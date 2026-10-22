import { createClient } from 'jsr:@supabase/supabase-js@2';

const ALLOWED_ORIGINS=new Set(['https://www.madyclear.fr','https://madyclear.fr']);
const MAX_BODY_BYTES=20000;

const cors=(origin:string)=>({
  'Access-Control-Allow-Origin':ALLOWED_ORIGINS.has(origin)?origin:'https://www.madyclear.fr',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':'POST,OPTIONS',
  'Vary':'Origin'
});
const json=(body:unknown,status=200,origin='')=>new Response(JSON.stringify(body),{
  status,
  headers:{
    ...cors(origin),
    'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':'no-store',
    'X-Content-Type-Options':'nosniff'
  }
});
const clean=(v:unknown,max=200)=>String(v??'').trim().slice(0,max);
const validEmail=(v:string)=>!v||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const validPhone=(v:string)=>{
  if(!v)return true;
  const digits=v.replace(/\D/g,'');
  return digits.length>=8&&digits.length<=15;
};
const clientIp=(req:Request)=>{
  const forwarded=(req.headers.get('x-forwarded-for')||'').split(',')[0].trim();
  return forwarded||req.headers.get('cf-connecting-ip')||req.headers.get('x-real-ip')||'';
};
const hashIp=async(ip:string)=>{
  if(!ip)return '';
  const data=new TextEncoder().encode('madyclear-rate-v1:'+ip);
  const digest=await crypto.subtle.digest('SHA-256',data);
  return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
};

// Delivery runs after the durable transaction, independently of the visitor's browser.
async function deliverEmails(svc: ReturnType<typeof createClient>) {
  const {data: jobs,error}=await svc.rpc('madyclear_claim_form_emails');
  if(error) { console.error('form_email_claim_failed',error.code); return; }
  await Promise.all((jobs||[]).map(async(job:any)=>{
    let failure='';
    try {
      const response=await fetch('https://formsubmit.co/ajax/ce821da5d338a55b404a6c0c1a18b0e0',{
        method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json','Origin':'https://www.madyclear.fr','Referer':'https://www.madyclear.fr/'},
        body:JSON.stringify(job.payload.email),signal:AbortSignal.timeout(30000)
      });
      if(!response.ok) throw new Error('provider_http_'+response.status);
      const result=await response.json();
      if(result?.success!==true&&result?.success!=='true') throw new Error('provider_unconfirmed');
    } catch(error) { failure=error instanceof Error?error.message.slice(0,160):'delivery_failed'; }
    const patch=failure
      ?{status:'pending',last_error:failure,next_attempt_at:new Date(Date.now()+Math.min(3600,60*2**Math.min(job.attempts,6))*1000).toISOString()}
      :{status:'succeeded',last_error:null,processed_at:new Date().toISOString()};
    const {error:updateError}=await svc.from('madyclear_automation_outbox').update(patch).eq('id',job.id).eq('status','processing').eq('attempts',job.attempts);
    if(updateError) console.error('form_email_status_failed',updateError.code);
  }));
}

Deno.serve(async(req)=>{
  const origin=req.headers.get('origin')||'';
  if(origin&&!ALLOWED_ORIGINS.has(origin))return json({error:'forbidden_origin'},403,origin);

  if(req.method==='OPTIONS')return new Response('ok',{headers:cors(origin)});
  if(req.method!=='POST')return json({error:'method_not_allowed'},405,origin);

  const svc=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  if(new URL(req.url).searchParams.get('task')==='notifications'){
    const token=req.headers.get('x-madyclear-worker')||'';
    if(!token||token.length>200)return json({error:'unauthorized'},401,origin);
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));
    const keyHash=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
    const {data:config}=await svc.from('madyclear_form_delivery_config').select('id').eq('id',true).eq('key_hash',keyHash).maybeSingle();
    if(!config)return json({error:'unauthorized'},401,origin);
    EdgeRuntime.waitUntil(deliverEmails(svc));
    return json({ok:true},202,origin);
  }
  const declaredLength=Number(req.headers.get('content-length')||0);
  if(declaredLength>MAX_BODY_BYTES)return json({error:'payload_too_large'},413,origin);

  let body:any;
  try{const raw=await req.text();if(new TextEncoder().encode(raw).byteLength>MAX_BODY_BYTES)return json({error:'payload_too_large'},413,origin);body=JSON.parse(raw)}catch{return json({error:'invalid_json'},400,origin)}
  if(!body||typeof body!=='object'||Array.isArray(body))return json({error:'invalid_payload'},400,origin);

  // Honeypot anti-bot.
  if(clean(body.website,80))return json({error:'invalid_payload'},422,origin);

  // This public endpoint is dedicated to MADYCLEAR only.
  const requestedSlug=clean(body.workspace_slug||'madyclear',80);
  if(requestedSlug!=='madyclear')return json({error:'workspace_not_found'},404,origin);

  const first=clean(body.first_name,80),last=clean(body.last_name,80),company=clean(body.company_name,120);
  const phone=clean(body.phone,40),email=clean(body.email,160),commune=clean(body.commune,100),address=clean(body.address_line,240),summary=clean(body.summary,1000);
  const source=clean(body.source_channel||'web',60),campaign=clean(body.campaign_code,100),serviceCode=clean(body.service_code,100);

  if(!(first||last||company)||!(phone||email)||summary.length<3)return json({error:'missing_required_fields'},422,origin);
  if(!validEmail(email)||!validPhone(phone))return json({error:'invalid_contact'},422,origin);

  let requestedAt:string|null=null;
  if(body.requested_at){
    const d=new Date(body.requested_at);
    if(!Number.isNaN(d.getTime()))requestedAt=d.toISOString();
  }
  const value=Number.isFinite(Number(body.estimated_value))?Math.max(0,Math.min(10000,Number(body.estimated_value))):null;
  const lat=Number.isFinite(Number(body.latitude))?Number(body.latitude):null;
  const lng=Number.isFinite(Number(body.longitude))?Number(body.longitude):null;

  const ipHash=await hashIp(clientIp(req));
  const {data:w,error:we}=await svc.from('madyclear_workspaces').select('id').eq('public_slug','madyclear').maybeSingle();
  if(we||!w)return json({error:'workspace_not_found'},404,origin);

  let campaignId:null|string=null,serviceId:null|string=null,serviceMinutes=90;
  if(campaign){
    const {data}=await svc.from('madyclear_campaigns').select('id').eq('workspace_id',w.id).eq('code',campaign).maybeSingle();
    campaignId=data?.id??null;
  }
  if(serviceCode){
    const {data}=await svc.from('madyclear_services').select('id,estimated_minutes').eq('workspace_id',w.id).eq('code',serviceCode).maybeSingle();
    serviceId=data?.id??null;
    serviceMinutes=data?.estimated_minutes??90;
  }

  let score=48;
  if(phone)score+=7;
  if(commune)score+=5;
  if(requestedAt)score+=10;
  if(value&&value>=170)score+=12;else if(value&&value>=95)score+=8;
  if(Number(body.photos_count)>0)score+=8;
  score=Math.min(96,score);
  const temperature=score>=85?'très_chaud':score>=70?'chaud':score>=45?'tiède':'froid';

  const id=body.submission_id||crypto.randomUUID();
  if(typeof id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))return json({error:'invalid_submission_id'},422,origin);
  const normalized={first,last,company,phone,email,commune,address,summary,source,campaign_id:campaignId,service_id:serviceId,service_minutes:serviceMinutes,
    requested_at:requestedAt,value,lat,lng,score,temperature,photos_count:Number(body.photos_count||0),client_note:clean(body.client_note,500),marketing_consent:Boolean(body.marketing_consent)};
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(normalized)));
  const requestHash=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
  const {data:result,error}=await svc.rpc('madyclear_capture_form',{p_id:id,p:{...normalized,request_hash:requestHash},p_ip:ipHash,p_agent:req.headers.get('user-agent')||''});
  if(error){
    if(error.message.includes('rate_limited'))return json({error:'rate_limited',retry_after_seconds:900},429,origin);
    if(error.message.includes('submission_conflict'))return json({error:'submission_conflict'},409,origin);
    console.error('form_capture_failed',error.code);
    return json({error:'capture_failed'},500,origin);
  }
  EdgeRuntime.waitUntil(deliverEmails(svc));
  return json({...result,notification_status:'queued',next_step:'Demande enregistrée. MADYCLEAR vous recontacte.'},201,origin);
});
