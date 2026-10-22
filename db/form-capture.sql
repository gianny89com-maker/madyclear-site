-- Atomic capture, idempotent retries, and a durable email queue. Server role only.
create or replace function public.madyclear_capture_form(p_id uuid, p jsonb, p_ip text, p_agent text)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  w uuid; c uuid; l uuid; b uuid; existing_hash text; ref text;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_id::text, 0));
  ref := 'MC-' || upper(p_id::text);
  select s.lead_id, lead.structured_need->>'request_hash' into l, existing_hash
  from public.madyclear_public_submissions s left join public.madyclear_leads lead on lead.id=s.lead_id where s.id=p_id;
  if found then
    if existing_hash is distinct from p->>'request_hash' then raise exception 'submission_conflict'; end if;
    return jsonb_build_object('ok',true,'reference',ref,'duplicate',true);
  end if;
  if coalesce(p_ip,'')<>'' then
    perform pg_advisory_xact_lock(hashtextextended(p_ip, 1));
    if (select count(*) from public.madyclear_public_submissions where ip_hint=p_ip and created_at>now()-interval '15 minutes')>=5 then
      raise exception 'rate_limited';
    end if;
  end if;
  select id into w from public.madyclear_workspaces where public_slug='madyclear';
  if w is null then raise exception 'workspace_not_found'; end if;
  insert into public.madyclear_customers(workspace_id,type,first_name,last_name,company_name,phone,email,address_line,commune,latitude,longitude,marketing_consent)
  values(w,case when coalesce(p->>'company','')<>'' then 'professionnel' else 'particulier' end,
    nullif(p->>'first',''),nullif(p->>'last',''),nullif(p->>'company',''),nullif(p->>'phone',''),nullif(p->>'email',''),nullif(p->>'address',''),nullif(p->>'commune',''),
    (p->>'lat')::numeric,(p->>'lng')::numeric,coalesce((p->>'marketing_consent')::boolean,false)) returning id into c;
  insert into public.madyclear_leads(workspace_id,customer_id,campaign_id,service_id,status,source_channel,summary,requested_at,estimated_value,score,temperature,next_action_type,next_action_at,structured_need)
  values(w,c,(p->>'campaign_id')::uuid,(p->>'service_id')::uuid,'nouveau',p->>'source',p->>'summary',(p->>'requested_at')::timestamptz,(p->>'value')::numeric,
    (p->>'score')::integer,p->>'temperature',case when p->>'requested_at' is null then 'Qualifier rapidement' else 'Confirmer le créneau' end,
    now()+interval '30 minutes',jsonb_build_object('photos_count',p->'photos_count','client_note',p->>'client_note','request_hash',p->>'request_hash','reference',ref)) returning id into l;
  if p->>'requested_at' is not null and p->>'service_id' is not null then
    insert into public.madyclear_bookings(workspace_id,customer_id,lead_id,service_id,status,starts_at,ends_at,address_line,commune,latitude,longitude,deposit_status)
    values(w,c,l,(p->>'service_id')::uuid,'requested',(p->>'requested_at')::timestamptz,(p->>'requested_at')::timestamptz+make_interval(mins=>(p->>'service_minutes')::integer),
      nullif(p->>'address',''),nullif(p->>'commune',''),(p->>'lat')::numeric,(p->>'lng')::numeric,'none') returning id into b;
  end if;
  insert into public.madyclear_lead_events(workspace_id,lead_id,event_type,channel,payload)
  values(w,l,'lead_created',p->>'source',jsonb_build_object('booking_id',b,'reference',ref));
  insert into public.madyclear_public_submissions(id,workspace_id,lead_id,source,ip_hint,user_agent)
  values(p_id,w,l,p->>'source',nullif(p_ip,''),left(p_agent,250));
  update public.madyclear_automation_outbox set payload=payload||jsonb_build_object('delivery','formsubmit_v1','email',
    jsonb_build_object('_subject','[MADYCLEAR] Nouvelle demande '||case when coalesce(p->>'company','')<>'' then 'PRO' else 'PARTICULIER' end||' — '||ref,
      '_cc','contact@madyclear.fr','_template','table','name',trim(concat_ws(' ',p->>'first',p->>'last')),
      'Référence',ref,'Entreprise',p->>'company','Téléphone',p->>'phone','Commune ou site',p->>'commune','Adresse',p->>'address',
      'Demande',p->>'summary','Précisions',p->>'client_note','Origine',p->>'source','Date',now()::text,'_honey','')
    ||case when coalesce(p->>'email','')<>'' then jsonb_build_object('email',p->>'email') else '{}'::jsonb end)
  where related_id=l and event_type='lead.created' and provider='gmail' and action_type='send_owner_lead_alert';
  if not found then raise exception 'notification_queue_missing'; end if;
  return jsonb_build_object('ok',true,'reference',ref,'duplicate',false);
end $$;
revoke all on function public.madyclear_capture_form(uuid,jsonb,text,text) from public,anon,authenticated;
grant execute on function public.madyclear_capture_form(uuid,jsonb,text,text) to service_role;

-- Claim queue items with a lease, so overlapping workers do not send twice.
create or replace function public.madyclear_claim_form_emails()
returns setof public.madyclear_automation_outbox language sql security invoker set search_path='' as $$
  with candidates as (
    select id from public.madyclear_automation_outbox
    where payload->>'delivery'='formsubmit_v1' and provider='gmail' and action_type='send_owner_lead_alert'
      and ((status='pending' and next_attempt_at<=now()) or (status='processing' and next_attempt_at<=now()))
    order by created_at limit 5 for update skip locked
  )
  update public.madyclear_automation_outbox q set status='processing', attempts=attempts+1,next_attempt_at=now()+interval '5 minutes'
  from candidates c where q.id=c.id returning q.*;
$$;
revoke all on function public.madyclear_claim_form_emails() from public,anon,authenticated;
grant execute on function public.madyclear_claim_form_emails() to service_role;

create table if not exists public.madyclear_form_delivery_config (id boolean primary key default true check(id),key_hash text not null);
alter table public.madyclear_form_delivery_config enable row level security;
revoke all on public.madyclear_form_delivery_config from public,anon,authenticated;
grant select on public.madyclear_form_delivery_config to service_role;
do $$ declare token text; begin
  select decrypted_secret into token from vault.decrypted_secrets where name='madyclear_form_delivery_key';
  if token is null then
    token:=encode(extensions.gen_random_bytes(32),'hex');
    perform vault.create_secret(token,'madyclear_form_delivery_key','MADYCLEAR form notification worker only');
  end if;
  insert into public.madyclear_form_delivery_config(id,key_hash) values(true,encode(extensions.digest(token,'sha256'),'hex')) on conflict(id) do nothing;
end $$;
