(function(){
'use strict';

const MAIN_STORE='madyclear-personal-v1';
const AUTH_STORE='madyclear-supabase-auth-v1';
const SYNC_STORE='madyclear-sync-state-v1';
const VERSION='1.9.0-sync';
const SUPABASE_URL='https://trvmbwpwnpimrxrmvrgd.supabase.co';
const PUBLISHABLE_KEY='sb_publishable_t5KTbJLqhvDuMnb_ZYva-w_dRLmsSZ5';
const SYNC_URL=SUPABASE_URL+'/functions/v1/madyclear-sync';
const WORKSPACE_SLUG='madyclear';

const $=id=>document.getElementById(id);
const now=()=>new Date().toISOString();
const uid=()=>crypto.randomUUID?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
const clean=v=>String(v??'').trim();
const normPhone=v=>{let d=String(v||'').replace(/\D/g,'');if(!d)return '';if(d.startsWith('596'))return d;if(d.startsWith('0')&&d.length===10)return '596'+d.slice(1);return d};
const normEmail=v=>clean(v).toLowerCase();
const readJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'')||fallback}catch{return fallback}};
const writeJSON=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
const readMain=()=>readJSON(MAIN_STORE,{});
const writeMain=value=>writeJSON(MAIN_STORE,value);
const readSync=()=>readJSON(SYNC_STORE,{deviceId:'',lastSync:'',lastResult:null,tasks:[],bookings:[],status:'LOCAL'});
const writeSync=value=>writeJSON(SYNC_STORE,value);
const readAuth=()=>readJSON(AUTH_STORE,null);
const writeAuth=value=>value?writeJSON(AUTH_STORE,value):localStorage.removeItem(AUTH_STORE);

function getDeviceId(){
  const s=readSync();
  if(!s.deviceId){s.deviceId=uid();writeSync(s)}
  return s.deviceId;
}
function tokenExpiresSoon(session){return !session?.access_token||!session?.expires_at||Number(session.expires_at)-Date.now()<60000}
function authHeaders(token){return {'apikey':PUBLISHABLE_KEY,'Authorization':`Bearer ${token}`,'Content-Type':'application/json'}}
function publicHeaders(){return {'apikey':PUBLISHABLE_KEY,'Content-Type':'application/json'}}

async function authRequest(path,body){
  const r=await fetch(SUPABASE_URL+path,{method:'POST',headers:publicHeaders(),body:JSON.stringify(body)});
  const data=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(data?.msg||data?.message||data?.error_description||data?.error||`Authentification HTTP ${r.status}`);
  return data;
}
function normalizeSession(data,email=''){
  const expiresIn=Number(data.expires_in||3600);
  return {access_token:data.access_token,refresh_token:data.refresh_token,expires_at:Date.now()+expiresIn*1000,email:data.user?.email||email||'',user_id:data.user?.id||''};
}
async function loginPassword(email,password){
  if(!email||!password)throw new Error('E-mail et mot de passe requis.');
  const data=await authRequest('/auth/v1/token?grant_type=password',{email,password});
  const session=normalizeSession(data,email);writeAuth(session);return session;
}
async function requestMagicLink(email){
  if(!email)throw new Error('E-mail requis.');
  const r=await fetch(SUPABASE_URL+'/auth/v1/otp',{method:'POST',headers:publicHeaders(),body:JSON.stringify({email,create_user:false,gotrue_meta_security:{captcha_token:null},data:{},code_challenge:null,code_challenge_method:null,redirect_to:'https://www.madyclear.fr/app/'})});
  const data=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(data?.msg||data?.message||data?.error_description||data?.error||`Lien impossible HTTP ${r.status}`);
  return true;
}
async function refreshSession(session=readAuth()){
  if(!session?.refresh_token)throw new Error('Connexion requise.');
  const data=await authRequest('/auth/v1/token?grant_type=refresh_token',{refresh_token:session.refresh_token});
  const fresh=normalizeSession(data,session.email);writeAuth(fresh);return fresh;
}
async function validSession(){
  let s=readAuth();
  if(!s)return null;
  if(tokenExpiresSoon(s)){try{s=await refreshSession(s)}catch{writeAuth(null);return null}}
  return s;
}
async function signOut(){
  const s=readAuth();
  writeAuth(null);
  if(s?.access_token){try{await fetch(SUPABASE_URL+'/auth/v1/logout',{method:'POST',headers:authHeaders(s.access_token)})}catch{}}
  const meta=readSync();meta.status='LOCAL';writeSync(meta);render();
}

function parseAuthCallback(){
  const hash=new URLSearchParams(location.hash.replace(/^#/,''));
  if(hash.get('access_token')&&hash.get('refresh_token')){
    const session={access_token:hash.get('access_token'),refresh_token:hash.get('refresh_token'),expires_at:Date.now()+Number(hash.get('expires_in')||3600)*1000,email:'',user_id:''};
    writeAuth(session);
    history.replaceState(null,'',location.pathname+location.search);
    return true;
  }
  return false;
}

function localIsNewer(local,remote){
  const lt=Date.parse(local?.updatedAt||'')||0;
  const rt=Date.parse(remote?.remoteUpdatedAt||remote?.remoteCreatedAt||'')||0;
  return lt>rt;
}
function findLocalContact(contacts,remote){
  if(remote.localId){const byId=contacts.find(c=>String(c.id)===String(remote.localId));if(byId)return byId}
  if(remote.cloudLeadId){const byCloud=contacts.find(c=>c.cloudLeadId===remote.cloudLeadId);if(byCloud)return byCloud}
  const rp=normPhone(remote.phone),re=normEmail(remote.email);
  return contacts.find(c=>(rp&&normPhone(c.phone)===rp)||(re&&normEmail(c.email)===re));
}
function mergePulledContacts(main,remoteContacts){
  main.contacts=Array.isArray(main.contacts)?main.contacts:[];
  let added=0,updated=0,linked=0;
  for(const r of remoteContacts||[]){
    let c=findLocalContact(main.contacts,r);
    if(!c){
      c={id:r.localId||`cloud-${r.cloudLeadId}`,name:r.name||'Prospect MADYCLEAR',segment:r.segment||'Prospect',commune:r.commune||'',phone:r.phone||'',email:r.email||'',status:r.status||'Prospect',priority:r.priority||'Moyenne',value:Number(r.value||0),followup:r.followup||'',next:r.next||'',notes:r.notes||'',source:r.source||'Supabase',channel:r.channel||'',automation:r.automation||'Assistée',updatedAt:r.remoteUpdatedAt||r.remoteCreatedAt||now(),cloudLeadId:r.cloudLeadId,cloudCustomerId:r.cloudCustomerId,remoteUpdatedAt:r.remoteUpdatedAt||''};
      main.contacts.unshift(c);added++;continue;
    }
    const beforeCloud=c.cloudLeadId;
    c.cloudLeadId=r.cloudLeadId||c.cloudLeadId;
    c.cloudCustomerId=r.cloudCustomerId||c.cloudCustomerId;
    c.remoteUpdatedAt=r.remoteUpdatedAt||c.remoteUpdatedAt;
    if(!beforeCloud&&c.cloudLeadId)linked++;
    c.name=c.name||r.name;c.segment=c.segment||r.segment;c.commune=c.commune||r.commune;c.phone=c.phone||r.phone;c.email=c.email||r.email;
    if(!localIsNewer(c,r)){
      c.status=r.status||c.status;c.priority=r.priority||c.priority;c.value=Number(r.value??c.value??0);c.followup=r.followup||'';c.next=r.next||c.next;c.source=r.source||c.source;c.channel=r.channel||c.channel;c.score=r.score??c.score;c.updatedAt=r.remoteUpdatedAt||c.updatedAt||now();updated++;
    }
  }
  return {added,updated,linked};
}

async function callSync(action='sync'){
  if(!navigator.onLine)throw new Error('Hors ligne : les données locales sont conservées.');
  const session=await validSession();if(!session)throw new Error('Connexion propriétaire requise.');
  const main=readMain();
  const payload={action,workspace_slug:WORKSPACE_SLUG,client_version:VERSION,device_id:getDeviceId(),contacts:Array.isArray(main.contacts)?main.contacts:[],quotes:Array.isArray(main.quotes)?main.quotes:[]};
  const r=await fetch(SYNC_URL,{method:'POST',headers:authHeaders(session.access_token),body:JSON.stringify(payload)});
  let data=await r.json().catch(()=>({}));
  if(r.status===401){const fresh=await refreshSession(session);const retry=await fetch(SYNC_URL,{method:'POST',headers:authHeaders(fresh.access_token),body:JSON.stringify(payload)});data=await retry.json().catch(()=>({}));if(!retry.ok)throw new Error(data?.error||`Synchronisation HTTP ${retry.status}`)}
  else if(!r.ok)throw new Error(data?.error||`Synchronisation HTTP ${r.status}`);

  const merge=mergePulledContacts(main,data?.pulled?.contacts||[]);
  writeMain(main);
  const meta=readSync();meta.lastSync=data.server_time||now();meta.lastResult={summary:data.summary||{},merge};meta.tasks=data?.pulled?.tasks||[];meta.bookings=data?.pulled?.bookings||[];meta.status='SYNCED';meta.lastError='';writeSync(meta);
  return {data,merge};
}

function injectStyle(){
  if($('madySyncStyle'))return;
  const st=document.createElement('style');st.id='madySyncStyle';st.textContent=`
#madySyncBtn{border:0;border-radius:999px;padding:7px 10px;font-weight:800;font-size:11px;cursor:pointer;background:#17394a;color:#d8f5f3;white-space:nowrap}#madySyncBtn[data-state="SYNCED"]{background:#0e6f69;color:#fff}#madySyncBtn[data-state="ERROR"]{background:#7b2f36;color:#fff}#madySyncModal{position:fixed;inset:0;z-index:9999;background:#031019d9;display:none;align-items:flex-end;justify-content:center}#madySyncModal.open{display:flex}.mady-sync-panel{width:min(680px,100%);max-height:92vh;overflow:auto;background:#071c29;color:#eff9fb;border:1px solid #214555;border-radius:24px 24px 0 0;padding:18px;box-shadow:0 -20px 70px #0008}.mady-sync-head{display:flex;gap:12px;align-items:center}.mady-sync-head>div{flex:1}.mady-sync-head h2{margin:3px 0}.mady-sync-head small,.mady-sync-note{color:#9eb4bf}.mady-sync-close{border:0;background:#183441;color:#fff;width:40px;height:40px;border-radius:12px;font-size:20px}.mady-sync-box{margin-top:14px;padding:14px;border-radius:16px;background:#0c2533;border:1px solid #1d4251}.mady-sync-status{display:flex;align-items:center;gap:8px;font-weight:800}.mady-sync-dot{width:9px;height:9px;border-radius:50%;background:#8999a0}.mady-sync-dot.ok{background:#1ec7a7}.mady-sync-dot.warn{background:#f2aa4c}.mady-sync-dot.err{background:#ef6671}.mady-sync-form{display:grid;gap:9px;margin-top:12px}.mady-sync-form input{width:100%;box-sizing:border-box;border:1px solid #315564;border-radius:12px;padding:12px;background:#061722;color:#fff}.mady-sync-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.mady-sync-actions button{border:0;border-radius:12px;padding:11px 13px;font-weight:800;cursor:pointer}.mady-sync-primary{background:#12aaa4;color:#fff}.mady-sync-secondary{background:#183d4d;color:#fff}.mady-sync-danger{background:#522a31;color:#fff}.mady-sync-report{font-size:13px;line-height:1.55;margin-top:8px;color:#d1e0e6}.mady-sync-hidden{display:none!important}@media(min-width:720px){#madySyncModal{align-items:center}.mady-sync-panel{border-radius:24px}}
  `;document.head.appendChild(st);
}
function injectUI(){
  injectStyle();
  if(!$('madySyncBtn')){
    const btn=document.createElement('button');btn.id='madySyncBtn';btn.type='button';btn.textContent='☁ SYNC';btn.onclick=()=>openModal();
    const top=document.querySelector('.top-actions')||document.querySelector('.topbar');if(top)top.prepend(btn);else document.body.appendChild(btn);
  }
  if(!$('madySyncModal')){
    const modal=document.createElement('div');modal.id='madySyncModal';modal.innerHTML=`<section class="mady-sync-panel" role="dialog" aria-modal="true" aria-labelledby="madySyncTitle"><div class="mady-sync-head"><div><small>DIGISTAFF • CLOUD</small><h2 id="madySyncTitle">Synchronisation MADYCLEAR</h2><small>Le cockpit reste utilisable hors connexion. Aucune relance client n'est envoyée par cette fonction.</small></div><button class="mady-sync-close" id="madySyncClose" aria-label="Fermer">×</button></div><div class="mady-sync-box"><div class="mady-sync-status"><span class="mady-sync-dot" id="madySyncDot"></span><span id="madySyncState">LOCAL</span></div><div id="madySyncReport" class="mady-sync-report"></div></div><div id="madySyncLoginBox" class="mady-sync-box"><strong>Connexion propriétaire</strong><p class="mady-sync-note">Le mot de passe est envoyé directement à Supabase Auth et n'est jamais enregistré dans MADYCLEAR.</p><form id="madySyncLoginForm" class="mady-sync-form"><input id="madySyncEmail" type="email" autocomplete="username" placeholder="E-mail Supabase" required><input id="madySyncPassword" type="password" autocomplete="current-password" placeholder="Mot de passe" required><button class="mady-sync-primary" type="submit">Connecter le cockpit</button></form><div class="mady-sync-actions"><button type="button" id="madySyncMagic" class="mady-sync-secondary">Recevoir un lien de connexion</button></div></div><div id="madySyncConnectedBox" class="mady-sync-box mady-sync-hidden"><strong id="madySyncAccount">Compte connecté</strong><div class="mady-sync-actions"><button type="button" id="madySyncNow" class="mady-sync-primary">Synchroniser maintenant</button><button type="button" id="madySyncLogout" class="mady-sync-danger">Déconnecter</button></div><p class="mady-sync-note">Synchronisation manuelle par défaut : aucun envoi automatique externe sans ton action.</p></div></section>`;
    document.body.appendChild(modal);
    $('madySyncClose').onclick=closeModal;modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
    $('madySyncLoginForm').onsubmit=async e=>{e.preventDefault();await doLogin()};
    $('madySyncMagic').onclick=async()=>{const email=clean($('madySyncEmail').value);try{setBusy('Envoi du lien…');await requestMagicLink(email);setMessage('Lien envoyé. Vérifie ta boîte mail.',true)}catch(err){setMessage(String(err.message||err),false)}finally{render()}};
    $('madySyncNow').onclick=async()=>{await doSync()};$('madySyncLogout').onclick=async()=>{await signOut();setMessage('Cockpit déconnecté du cloud.',true)};
  }
}
function openModal(){$('madySyncModal')?.classList.add('open');render()}
function closeModal(){$('madySyncModal')?.classList.remove('open')}
function setBusy(msg){const r=$('madySyncReport');if(r)r.textContent=msg;const b=$('madySyncNow');if(b)b.disabled=true}
function setMessage(msg,ok=true){const r=$('madySyncReport');if(r)r.textContent=msg;const d=$('madySyncDot');if(d)d.className='mady-sync-dot '+(ok?'ok':'err')}
async function doLogin(){
  const email=clean($('madySyncEmail').value),password=String($('madySyncPassword').value||'');
  try{setBusy('Connexion sécurisée…');await loginPassword(email,password);$('madySyncPassword').value='';setMessage('Connexion réussie. Tu peux synchroniser.',true);render()}catch(err){setMessage(String(err.message||err),false);render()}
}
async function doSync(){
  try{setBusy('Synchronisation en cours…');const {data,merge}=await callSync('sync');const p=data?.summary?.pushed||{};const errs=data?.summary?.errors?.length||0;setMessage(`${p.contacts||0} contact(s) envoyé(s) • ${merge.added} nouveau(x) reçu(s) • ${merge.updated} mis à jour • ${p.quotes||0} devis envoyé(s)${errs?` • ${errs} erreur(s)`:''}`,errs===0);render();setTimeout(()=>location.reload(),900)}catch(err){const meta=readSync();meta.status=navigator.onLine?'ERROR':'OFFLINE';meta.lastError=String(err.message||err);writeSync(meta);setMessage(meta.lastError,false);render()}
}
async function render(){
  const session=await validSession();const meta=readSync();const btn=$('madySyncBtn');const login=$('madySyncLoginBox'),connected=$('madySyncConnectedBox');
  let state='LOCAL',label='☁ SYNC';if(!navigator.onLine){state='OFFLINE';label='◌ HORS LIGNE'}else if(session){state=meta.status==='ERROR'?'ERROR':meta.lastSync?'SYNCED':'CONNECTED';label=state==='SYNCED'?'✓ SYNC':'☁ CONNECTÉ'}
  if(btn){btn.dataset.state=state;btn.textContent=label}
  if(login)login.classList.toggle('mady-sync-hidden',!!session);if(connected)connected.classList.toggle('mady-sync-hidden',!session);
  if(session&&$('madySyncAccount'))$('madySyncAccount').textContent=session.email?`Connecté : ${session.email}`:'Compte propriétaire connecté';
  const dot=$('madySyncDot'),st=$('madySyncState'),report=$('madySyncReport');
  if(dot)dot.className='mady-sync-dot '+(state==='SYNCED'||state==='CONNECTED'?'ok':state==='ERROR'?'err':'warn');
  if(st)st.textContent=state==='SYNCED'?'SYNCHRONISÉ':state==='CONNECTED'?'CONNECTÉ':state==='OFFLINE'?'HORS LIGNE':state==='ERROR'?'ERREUR':'LOCAL';
  if(report&&!report.textContent){if(meta.lastSync)report.textContent=`Dernière synchronisation : ${new Date(meta.lastSync).toLocaleString('fr-FR')}`;else report.textContent=session?'Connexion active • première synchronisation à lancer.':'Les données restent uniquement sur cet appareil tant que tu ne connectes pas le cockpit.'}
  if($('madySyncNow'))$('madySyncNow').disabled=!session||!navigator.onLine;
}

parseAuthCallback();
document.addEventListener('DOMContentLoaded',()=>{injectUI();render()});
window.addEventListener('online',()=>render());window.addEventListener('offline',()=>render());
window.MADYCLEAR_SYNC={sync:doSync,login:loginPassword,logout:signOut,state:readSync};
})();
