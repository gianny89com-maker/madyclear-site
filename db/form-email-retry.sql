-- Invoke the protected worker only while this form's email queue has due work.
select cron.schedule('madyclear-form-email-retry','*/5 * * * *',$job$
  select net.http_post(
    url:='https://trvmbwpwnpimrxrmvrgd.supabase.co/functions/v1/madyclear-capture?task=notifications',
    headers:=jsonb_build_object('Content-Type','application/json','x-madyclear-worker',
      (select decrypted_secret from vault.decrypted_secrets where name='madyclear_form_delivery_key')),
    body:='{}'::jsonb,timeout_milliseconds:=10000
  ) where exists (
    select 1 from public.madyclear_automation_outbox
    where payload->>'delivery'='formsubmit_v1' and provider='gmail' and action_type='send_owner_lead_alert'
      and status in ('pending','processing') and next_attempt_at<=now()
  );
$job$);
