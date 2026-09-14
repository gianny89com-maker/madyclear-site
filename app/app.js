'use strict';
window.__MADYCLEAR_JS_LOADED__=true;
document.documentElement.classList.add('mady-js-loaded');
const STORE='madyclear-personal-v1';
const APP_VERSION='1.8.2';
const WA_NUMBER='596696017007';
const TODAY=()=>new Date().toISOString().slice(0,10);
const money=n=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number(n||0));
const uid=()=>`${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`;
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const normalizePhone=value=>{const d=String(value||'').replace(/\D/g,'');if(!d)return '';if(d.startsWith('596'))return d;if(d.startsWith('0')&&d.length===10)return '596'+d.slice(1);return d};
const waUrl=(phone,message='')=>{const p=normalizePhone(phone);return p?`https://wa.me/${p}${message?`?text=${encodeURIComponent(message)}`:''}`:'#'};

const pricing={
 textile:[
  {id:'pouf',name:'Pouf',price:50,sap:true,detail:'Domicile • textile'},
  {id:'chaise',name:'Chaise rembourrée',price:40,sap:true,detail:'Par unité'},
  {id:'fauteuil',name:'Fauteuil 1 place',price:80,sap:true,detail:'Domicile'},
  {id:'canape2',name:'Canapé 2 places',price:140,sap:true,detail:'Référence centrale • ≈ 70 € après avantage*'},
  {id:'canape3',name:'Canapé 3 places',price:160,sap:true,detail:'≈ 80 € après avantage*'},
  {id:'angle',name:'Canapé angle / 4–5 places',price:220,sap:true,detail:'À partir de'},
  {id:'grand',name:'Grand canapé / U',price:280,sap:true,detail:'À partir de'},
  {id:'mat1',name:'Matelas 1 place',price:100,sap:true,detail:'Domicile'},
  {id:'mat2',name:'Matelas 2 places',price:130,sap:true,detail:'Domicile'},
  {id:'queen',name:'Matelas Queen',price:150,sap:true,detail:'Domicile'},
  {id:'king',name:'Matelas King',price:170,sap:true,detail:'Domicile'},
  {id:'tapis',name:'Tapis synthétique — minimum',price:100,sap:true,detail:'30 €/m² • minimum affiché'}
 ],
 auto:[
  {id:'ext',name:'Extérieur',price:45,sap:false,detail:'Tarif public de référence'},
  {id:'int',name:'Intérieur',price:45,sap:false,detail:'Hors extraction lourde'},
  {id:'complet',name:'Complet',price:85,sap:false,detail:'Formule prioritaire'},
  {id:'profond',name:'Intérieur profond',price:90,sap:false,detail:'À partir de'},
  {id:'etat',name:'Remise en état',price:120,sap:false,detail:'À partir de / devis'}
 ],
 vitres:[
  {id:'vmin',name:'Minimum intervention',price:45,sap:false,detail:'Repère interne'},
  {id:'vdevis',name:'Vitrage / baies / vitrines',price:0,sap:false,detail:'Sur devis selon surface et accès'}
 ],
 pros:[
  {id:'banq',name:'Banquette professionnelle',price:75,sap:false,detail:'Minimum • volume sur devis'},
  {id:'lot',name:'Lot / contrat récurrent',price:0,sap:false,detail:'Sur devis'}
 ]
};
const defaultState={
 version:1.82,
 settings:{monthlyGoal:2000,monthlyCA:0,avgBasket:160},
 quote:{tab:'textile',qty:{}},quotes:[],notes:[],
 core:{
  endpoint:'',autoSync:false,lastSync:'',health:'LOCAL',lastAutopilot:'',
  queue:[],activity:[],validations:[],alerts:[],
  actionStats:{success:0,failed:0,lastAction:'',lastAt:''},
  actionPolicy:{autoScope:'LOCAL_ONLY',externalRequiresValidation:true,owner:'Gino',version:'1.0'},
  connectorStatus:{
    n8n:{state:'TO_CONNECT',label:'n8n'},
    supabase:{state:'TO_CONNECT',label:'Supabase'},
    gmail:{state:'TO_CONNECT',label:'Gmail'},
    calendar:{state:'TO_CONNECT',label:'Google Calendar'},
    drive:{state:'TO_CONNECT',label:'Google Drive'},
    weather:{state:'TO_CONNECT',label:'Météo'},
    whatsapp:{state:'TO_CONNECT',label:'WhatsApp Business'}
  },
  keepConnected:{mode:'PWA',network:navigator.onLine?'ONLINE':'OFFLINE',lastHeartbeat:'',lastResume:'',retryQueue:[],triggers:[],androidBridge:false},
  portal:{mode:'PRO',captures:[],activeModule:'auto',workSessions:[],shopping:[],jobs:[],shortcuts:[
    {id:'quick-prospect',label:'Nouveau prospect',icon:'＋',actionId:'sheet.contactSheet',scope:'PRO'},
    {id:'quick-photo',label:'Avant / Après',icon:'▣',actionId:'capture.photo',scope:'PRO'},
    {id:'quick-voice',label:'Note vocale',icon:'◉',actionId:'capture.voice',scope:'ALL'},
    {id:'quick-day',label:'Préparer ma journée',icon:'✦',actionId:'macro.prepare_day',scope:'PRO'},
    {id:'quick-hours',label:'Heures salarié',icon:'◷',actionId:'capture.hours',scope:'PERSO'},
    {id:'quick-pocket',label:'Vide-poche',icon:'◇',actionId:'capture.pocket',scope:'PERSO'}
  ]},
  channels:[
   {id:'cockpit',name:'Cockpit local',detail:'CRM, devis, projets, mémoire locale'},
   {id:'n8n',name:'n8n / Core',detail:'Orchestration distante'},
   {id:'gmail',name:'Gmail',detail:'E-mails et brouillons'},
   {id:'calendar',name:'Google Calendar',detail:'Rendez-vous'},
   {id:'drive',name:'Google Drive',detail:'Documents et sauvegardes'},
   {id:'whatsapp',name:'WhatsApp',detail:'Liens directs actifs • API à brancher'}
  ]
 },
 projects:[
  {id:'madyclear',name:'MADYCLEAR',label:'Priorité entrepreneuriale',status:'Prêt à lancer',progress:86,next:'Obtenir le SIRET puis lancer la déclaration SAP/NOVA.',tone:'cyan'},
  {id:'digistaff',name:'DIGISTAFF',label:'Moteur personnel & IA',status:'Construction',progress:58,next:'Faire de ce cockpit le premier outil opérationnel DIGISTAFF.',tone:'violet'},
  {id:'association',name:'Association Trois-Rivières',label:'Portail & structuration',status:'Avancé',progress:72,next:'Finaliser le dossier opérationnel puis remettre le portail en ligne.',tone:'gold'},
  {id:'escale',name:'Escale Bleue',label:'Demande d’emplacement',status:'Dossier mairie',progress:64,next:'Obtenir un accord de principe avant tout engagement matériel.',tone:'coral'}
 ],
 contacts:[
  {id:'bemude',name:'Bemude Charles',segment:'Particulier / carnet contacts',commune:'',phone:'06 96 80 66 91',email:'',status:'Prospect',priority:'Haute',value:140,followup:'',next:'Qualifier le besoin et la commune.',notes:'Contact initial transmis par Gino.'},
  {id:'filao',name:'Résidence Filao',segment:'Piste prioritaire',commune:'Sainte-Luce',phone:'',email:'',status:'À contacter',priority:'Haute',value:0,followup:'',next:'Retrouver / confirmer le contact du locataire.',notes:'Piste marquée comme prioritaire.'},
  {id:'pinkeys',name:'Pinkeys Conciergerie',segment:'Conciergerie',commune:'Trois-Rivières',phone:'06 96 78 32 17',email:'info@pinkeys.fr',status:'Prospect',priority:'Haute',value:300,followup:'',next:'Premier contact + proposition diagnostic photos.',notes:'Prospect A1 du dossier commercial.'},
  {id:'terresdo',name:'Terres d’Ô',segment:'Conciergerie / Gestion',commune:'Chemin Ladour',phone:'06 96 03 83 07',email:'terresdomartinique@gmail.com',status:'Prospect',priority:'Haute',value:300,followup:'',next:'Premier contact + proposition diagnostic photos.',notes:'Prospect A1 du dossier commercial.'},
  {id:'homer',name:'Home’R',segment:'Conciergerie / Gestion',commune:'Sainte-Luce',phone:'06 96 37 37 13',email:'contact@homer-martinique.com',status:'Prospect',priority:'Haute',value:300,followup:'',next:'Premier contact.',notes:'Prospect A1 du dossier commercial.'},
  {id:'madivillas',name:'Madivillas',segment:'Conciergerie Premium',commune:'Sainte-Luce',phone:'06 68 28 63 92',email:'hello@madivillas.com',status:'Prospect',priority:'Haute',value:350,followup:'',next:'Premier contact.',notes:'Prospect A1 du dossier commercial.'},
  {id:'karibea',name:'Karibea Sainte-Luce',segment:'Hôtel / Résidence',commune:'Désert',phone:'05 96 62 32 32',email:'commercial@karibeahotel.com',status:'Prospect',priority:'Haute',value:500,followup:'',next:'Identifier le décideur et proposer un test.',notes:'Prospect A1 du dossier commercial.'},
  {id:'pv',name:'Pierre & Vacances',segment:'Village Vacances',commune:'Pointe Philippeau',phone:'05 96 62 12 62',email:'',status:'Prospect',priority:'Haute',value:500,followup:'',next:'Identifier le décideur et proposer un test.',notes:'Prospect A1 du dossier commercial.'},
  {id:'cayalines',name:'Les Cayalines',segment:'Résidence hôtelière',commune:'Désert Plage',phone:'05 96 66 28 13',email:'contact@cayalines.com',status:'Prospect',priority:'Moyenne',value:400,followup:'',next:'Qualifier volume et fréquence.',notes:'Prospect A2.'},
  {id:'brisemarine',name:'Brise Marine Résidence',segment:'Résidence hôtelière',commune:'Gros Raisins',phone:'05 96 62 46 94',email:'brisemarine97@wanadoo.fr',status:'Prospect',priority:'Moyenne',value:400,followup:'',next:'Qualifier volume et fréquence.',notes:'Prospect A2.'},
  {id:'tiverger',name:'Ti Verger',segment:'Cottages',commune:'Sainte-Luce',phone:'06 96 39 85 30',email:'info@tiverger.com',status:'Prospect',priority:'Moyenne',value:300,followup:'',next:'Premier contact.',notes:'Prospect A2.'},
  {id:'allogia',name:'ALLOGIA',segment:'Agence / Gestion',commune:'Bourg Sainte-Luce',phone:'05 96 53 75 92',email:'contact@allogia.fr',status:'Prospect',priority:'Moyenne',value:350,followup:'',next:'Premier contact.',notes:'Prospect A2.'},
  {id:'archipel',name:'Archipel Évasion',segment:'Locations de vacances',commune:'Avenue des Sucriers',phone:'06 96 43 30 35',email:'contact@archipel-evasion.com',status:'Prospect',priority:'Moyenne',value:350,followup:'',next:'Premier contact.',notes:'Prospect A2.'}
 ]
};
const clone=x=>JSON.parse(JSON.stringify(x));
let state=load();
let clientFilter='Tous';
let digiMode='question';
let deferredPrompt=null;
function load(){try{const x=JSON.parse(localStorage.getItem(STORE));return x?merge(defaultState,x):clone(defaultState)}catch{return clone(defaultState)}}
function merge(base,custom){const cc=custom.core||{};return {...clone(base),...custom,settings:{...base.settings,...(custom.settings||{})},quote:{...base.quote,...(custom.quote||{})},core:{...clone(base.core),...cc,queue:Array.isArray(cc.queue)?cc.queue:[],activity:Array.isArray(cc.activity)?cc.activity:[],validations:Array.isArray(cc.validations)?cc.validations:[],alerts:Array.isArray(cc.alerts)?cc.alerts:[],actionStats:{...base.core.actionStats,...(cc.actionStats||{})},actionPolicy:{...base.core.actionPolicy,...(cc.actionPolicy||{})},connectorStatus:{...base.core.connectorStatus,...(cc.connectorStatus||{})},keepConnected:{...base.core.keepConnected,...(cc.keepConnected||{}),retryQueue:Array.isArray(cc.keepConnected?.retryQueue)?cc.keepConnected.retryQueue:[],triggers:Array.isArray(cc.keepConnected?.triggers)?cc.keepConnected.triggers:[]},portal:{...base.core.portal,...(cc.portal||{}),captures:Array.isArray(cc.portal?.captures)?cc.portal.captures:[],workSessions:Array.isArray(cc.portal?.workSessions)?cc.portal.workSessions:[],shopping:Array.isArray(cc.portal?.shopping)?cc.portal.shopping:[],jobs:Array.isArray(cc.portal?.jobs)?cc.portal.jobs:[],shortcuts:Array.isArray(cc.portal?.shortcuts)?cc.portal.shortcuts:base.core.portal.shortcuts},channels:Array.isArray(cc.channels)?cc.channels:base.core.channels},contacts:Array.isArray(custom.contacts)?custom.contacts:base.contacts,projects:Array.isArray(custom.projects)?custom.projects:base.projects,quotes:Array.isArray(custom.quotes)?custom.quotes:[],notes:Array.isArray(custom.notes)?custom.notes:[]}}
function save(){localStorage.setItem(STORE,JSON.stringify(state));renderAll()}
function toast(msg){const t=document.getElementById('toast');if(!t)return; t.textContent=msg;t.classList.remove('hidden');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.add('hidden'),2200)}

// Autonomous Core V1.4 — local-first + Action Engine. Le cloud reste optionnel.
function persist(){localStorage.setItem(STORE,JSON.stringify(state))}
function coreNow(){return new Date().toISOString()}
function addActivity(level,title,detail,eventId=''){
 state.core.activity.unshift({id:uid(),eventId,date:coreNow(),level,title,detail});
 state.core.activity=state.core.activity.slice(0,120);
}
function recordCoreEvent(eventType,payload={},severity='AUTO',title=''){
 const event={id:uid(),source:'cockpit',event_type:eventType,occurred_at:coreNow(),severity,payload,status:'PENDING',remoteStatus:state.core.endpoint?'QUEUED':'LOCAL_ONLY'};
 state.core.queue.unshift(event);state.core.queue=state.core.queue.slice(0,160);
 processLocalQueue();
 if(title&&!state.core.activity.some(a=>a.eventId===event.id))addActivity(severity,title,eventType,event.id);
 return event;
}
function processLocalQueue(){
 state.core.queue.forEach(event=>{
  if(event.status!=='PENDING')return;
  if(event.severity==='VALIDATION'){
   if(!state.core.validations.some(v=>v.eventId===event.id))state.core.validations.unshift({id:uid(),eventId:event.id,date:coreNow(),status:'PENDING',title:event.payload?.title||'Action à valider',reason:event.payload?.reason||'Cette action peut engager MADYCLEAR.',proposed:event.payload?.proposed||event.event_type});
   event.status='WAITING_VALIDATION';addActivity('VALIDATION',event.payload?.title||'Validation requise',event.payload?.reason||event.event_type,event.id);
  }else if(event.severity==='CRITIQUE'){
   if(!state.core.alerts.some(a=>a.eventId===event.id))state.core.alerts.unshift({id:uid(),eventId:event.id,date:coreNow(),acknowledged:false,title:event.payload?.title||'Alerte critique',message:event.payload?.message||event.event_type});
   event.status='BLOCKED_CRITICAL';addActivity('CRITIQUE',event.payload?.title||'Alerte critique',event.payload?.message||event.event_type,event.id);
  }else{
   event.status='LOCAL_DONE';addActivity('AUTO',event.payload?.title||labelEvent(event.event_type),event.payload?.detail||'Traitement local terminé.',event.id);
  }
 });
}
function labelEvent(type){return ({contact_saved:'CRM mis à jour',contact_deleted:'Contact supprimé',quote_saved:'Devis enregistré',note_saved:'Mémoire mise à jour',goal_updated:'Objectif mis à jour',hourly_scan:'Scan automatique',core_configured:'Connexion Core mise à jour',validation_approved:'Validation approuvée',validation_rejected:'Validation refusée'})[type]||type.replaceAll('_',' ')}

// MADYCLEAR Action Engine V1.4
// Un point d'entrée unique pour les boutons, macros et actions sûres.
const ACTION_REGISTRY=new Map();
function registerAction(id,config){ACTION_REGISTRY.set(id,{permission:'AUTO',log:true,...config})}
function actionStats(){return state.core.actionStats||(state.core.actionStats={success:0,failed:0,lastAction:'',lastAt:''})}
function directNavigate(name){
 document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===name));
 document.querySelectorAll('.bottom-nav [data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===name));
 try{window.scrollTo({top:0,behavior:'smooth'})}catch(e){window.scrollTo(0,0)}
 if(name==='clients')renderClients();
 if(name==='mady')renderQuote();
 if(name==='digi')renderNotes();
 return true;
}
function directOpenSheet(id){
 const overlay=document.getElementById('overlay'),s=document.getElementById(id);
 if(!s)throw new Error(`Panneau introuvable : ${id}`);
 if(overlay)overlay.classList.remove('hidden');
 s.classList.add('open');s.setAttribute('aria-hidden','false');
 return true;
}

function actionNeedsValidation(action,context={}){
 const explicitExternal = action?.scope==='EXTERNAL' || action?.external===true || context.external===true;
 const policy = state.core.actionPolicy || {externalRequiresValidation:true};
 return explicitExternal && policy.externalRequiresValidation;
}

async function runAction(id,context={}){
 const action=ACTION_REGISTRY.get(id);
 const stats=actionStats();
 if(!action){
  stats.failed++;stats.lastAction=id;stats.lastAt=coreNow();
  addActivity('VALIDATION','Action inconnue',id);persist();renderCore();
  if(context.fallback)try{return await context.fallback()}catch(e){}
  toast('Action non reconnue.');return false;
 }
 const started=Date.now();
 try{
  if((action.permission==='VALIDATION'||actionNeedsValidation(action,context))&&!context.approved){
   recordCoreEvent('button_action_validation',{title:action.label||id,reason:'Cette commande nécessite une validation humaine.',proposed:id,context},'VALIDATION');
   persist();renderAll();toast('Action ajoutée aux validations.');return false;
  }
  const result=await action.handler(context);
  stats.success++;stats.lastAction=action.label||id;stats.lastAt=coreNow();
  if(action.log!==false)addActivity('AUTO',action.label||id,`Succès • ${Date.now()-started} ms`);
  persist();renderCore();
  return result===undefined?true:result;
 }catch(err){
  stats.failed++;stats.lastAction=action.label||id;stats.lastAt=coreNow();
  addActivity('VALIDATION',`Échec • ${action.label||id}`,String(err?.message||err));
  persist();renderCore();
  if(action.fallback){
   try{
    const r=await action.fallback(context,err);
    addActivity('AUTO',`Secours • ${action.label||id}`,'Action de secours exécutée.');
    persist();renderCore();return r;
   }catch(fallbackErr){
    addActivity('CRITIQUE',`Secours impossible • ${action.label||id}`,String(fallbackErr?.message||fallbackErr));
    persist();renderCore();
   }
  }
  toast(`Action impossible : ${action.label||id}`);
  return false;
 }
}
async function runMacro(id,context={}){
 const macro=MACRO_REGISTRY[id];
 if(!macro)throw new Error(`Macro inconnue : ${id}`);
 for(const step of macro.steps){
  if(typeof step==='number'){await new Promise(r=>setTimeout(r,step));continue}
  const ok=await runAction(step,{...context,macro:id});
  if(ok===false&&macro.stopOnError!==false)throw new Error(`Étape bloquée : ${step}`);
 }
 return true;
}
const MACRO_REGISTRY={
 'prepare.day':{label:'Préparer ma journée',steps:['scan.priorities','nav.clients'],stopOnError:false},
 'safe.backup':{label:'Sauvegarde locale sûre',steps:['backup.export'],stopOnError:true}
};
['home','mady','clients','digi','projects'].forEach(name=>registerAction(`nav.${name}`,{
 label:`Navigation • ${name}`,log:false,
 handler:ctx=>{if(ctx.clientFilter)clientFilter=ctx.clientFilter;return directNavigate(name)},
 fallback:()=>window.MADYCLEAR_NAV?window.MADYCLEAR_NAV(name):directNavigate(name)
}));
['contactSheet','noteSheet','goalSheet','sapSheet','coreSheet','connectorSheet','backupSheet'].forEach(id=>registerAction(`sheet.${id}`,{
 label:`Ouvrir • ${id}`,log:false,handler:()=>directOpenSheet(id),
 fallback:()=>{const s=document.getElementById(id);if(s){s.classList.add('open');return true}return false}
}));
registerAction('core.sync',{label:'Synchroniser le Core',scope:'EXTERNAL',permission:'VALIDATION',handler:()=>syncCore()});
registerAction('scan.priorities',{label:'Scanner les priorités',handler:()=>{localAutopilot(true);return true}});
registerAction('backup.export',{label:'Exporter une sauvegarde',handler:()=>{download(`MADYCLEAR-cockpit-backup-${TODAY()}.json`,JSON.stringify(state,null,2));return true}});
registerAction('macro.prepare_day',{label:'Préparer ma journée',handler:()=>runMacro('prepare.day')});
registerAction('macro.safe_backup',{label:'Sauvegarde sûre',handler:()=>runMacro('safe.backup')});
window.MADYCLEAR_ACTIONS={run:runAction,macro:runMacro,register:registerAction,list:()=>Array.from(ACTION_REGISTRY.keys())};



// Portal Hub V1.7 — modules métier — raccourcis, voix, photos et capture multi-contexte
function portalState(){
 return state.core.portal||(state.core.portal={mode:'PRO',captures:[],shortcuts:[]});
}
function setPortalMode(mode){
 const p=portalState();p.mode=mode==='PERSO'?'PERSO':'PRO';
 persist();renderPortal();
 addActivity('AUTO','Mode portail',p.mode==='PRO'?'Entreprise':'Vie perso');
}
function addCapture(type,text='',meta={}){
 const p=portalState();
 const item={id:uid(),type,text:String(text||'').trim(),meta,createdAt:new Date().toISOString(),processed:false};
 p.captures.unshift(item);
 if(p.captures.length>100)p.captures=p.captures.slice(0,100);
 persist();renderPortal();
 addActivity('AUTO',`Capture • ${type}`,item.text||'Élément ajouté');
 return item;
}
function renderPortal(){
 const p=portalState();
 document.querySelectorAll('[data-portal-mode]').forEach(b=>b.classList.toggle('active',b.dataset.portalMode===p.mode));
 const grid=document.getElementById('portalShortcuts');
 if(grid){
  const items=p.shortcuts.filter(s=>s.scope==='ALL'||s.scope===p.mode);
  grid.innerHTML=items.map(s=>`<button class="portal-shortcut" data-action="${s.actionId}"><span>${esc(s.icon||'•')}</span><b>${esc(s.label)}</b></button>`).join('');
 }
 const cap=document.getElementById('portalCaptures');
 if(cap){
  cap.innerHTML=p.captures.length?p.captures.slice(0,6).map(c=>`<div class="capture-row"><span class="activity-badge AUTO">${esc(c.type)}</span><div><strong>${esc(c.text||'Capture')}</strong><small>${new Date(c.createdAt).toLocaleString('fr-FR')}</small></div></div>`).join(''):'<p class="empty">Aucune capture rapide.</p>';
 }
}
function voiceSupported(){return !!(window.SpeechRecognition||window.webkitSpeechRecognition)}
function startVoiceCapture(category='NOTE'){
 return new Promise((resolve,reject)=>{
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){directOpenSheet('noteSheet');toast('Dictée navigateur indisponible : saisis ta note.');return resolve(false)}
  const r=new SR();r.lang='fr-FR';r.interimResults=false;r.maxAlternatives=1;
  toast('Parle maintenant…');
  r.onresult=e=>{
   const text=e.results?.[0]?.[0]?.transcript||'';
   addCapture(category,text,{source:'voice'});
   const noteInput=document.getElementById('quickNote');
   if(noteInput)noteInput.value=text;
   toast('Note vocale capturée.');resolve(true);
  };
  r.onerror=e=>{addActivity('VALIDATION','Dictée vocale',e.error||'Erreur');reject(new Error(e.error||'Dictée impossible'))};
  r.start();
 });
}
function openPhotoCapture(){
 const input=document.getElementById('portalPhotoInput');
 if(!input)throw new Error('Entrée photo absente');
 input.click();return true;
}
function handlePortalPhoto(file){
 if(!file)return;
 addCapture('PHOTO',file.name||'Photo chantier',{size:file.size||0,type:file.type||'',localOnly:true});
 toast('Photo référencée dans le journal. Stockage Drive/Photo à brancher ensuite.');
}
registerAction('capture.voice',{label:'Capture vocale',handler:()=>startVoiceCapture(portalState().mode==='PRO'?'PRO':'PERSO')});
registerAction('capture.photo',{label:'Avant / Après',handler:()=>openPhotoCapture()});
registerAction('capture.hours',{label:'Heures salarié',handler:()=>{setPortalMode('PERSO');directOpenSheet('noteSheet');const x=document.getElementById('quickNote');if(x&&!x.value)x.value='Heures salarié : ';return true}});
registerAction('capture.pocket',{label:'Vide-poche',handler:()=>{setPortalMode('PERSO');directOpenSheet('noteSheet');const x=document.getElementById('quickNote');if(x&&!x.value)x.value='Vide-poche : ';return true}});
registerAction('portal.pro',{label:'Mode entreprise',log:false,handler:()=>{setPortalMode('PRO');return true}});
registerAction('portal.perso',{label:'Mode vie perso',log:false,handler:()=>{setPortalMode('PERSO');return true}});
window.MADYCLEAR_PORTAL={state:portalState,setMode:setPortalMode,capture:addCapture,voice:startVoiceCapture};


// Business & Life Modules V1.7
const MODULES={
 auto:{label:'Auto',icon:'🚗',desc:'Photo Avant / Après + fiche chantier locale',actions:['capture.photo','job.auto.new']},
 textile:{label:'Textile',icon:'🛋️',desc:'Fiche chantier + saisie dosage consommables',actions:['job.textile.new','textile.dosage']},
 vitres:{label:'Vitres',icon:'🪟',desc:'Fiche chantier + clients récurrents • météo à connecter',actions:['job.vitres.new','clients.recurring']},
 salarie:{label:'Salarié',icon:'💼',desc:'Pointage + bilan hebdomadaire local',actions:['work.clock','work.summary']},
 perso:{label:'Vie privée',icon:'🏡',desc:'Vide-poche mental + notes de courses',actions:['capture.pocket','shopping.add']}
};
function setActiveModule(id){
 if(!MODULES[id])return false;
 portalState().activeModule=id;
 persist();renderModules();addActivity('AUTO','Module actif',MODULES[id].label);return true;
}
function addJob(type){
 const p=portalState();
 const j={id:uid(),type,createdAt:new Date().toISOString(),status:'NOUVEAU',client:'',notes:''};
 p.jobs.unshift(j);persist();renderModules();addActivity('AUTO',`Chantier ${type}`,'Nouveau chantier créé');
 return j;
}
function clockWork(){
 const p=portalState();
 const open=p.workSessions.find(s=>!s.end);
 if(open){
   open.end=new Date().toISOString();
   open.durationMin=Math.max(0,Math.round((new Date(open.end)-new Date(open.start))/60000));
   addActivity('AUTO','Pointage salarié',`Départ • ${open.durationMin} min`);
 }else{
   p.workSessions.unshift({id:uid(),start:new Date().toISOString(),end:null,durationMin:0});
   addActivity('AUTO','Pointage salarié','Arrivée enregistrée');
 }
 persist();renderModules();return true;
}
function weekStart(date=new Date()){
 const d=new Date(date);d.setHours(0,0,0,0);const day=(d.getDay()+6)%7;d.setDate(d.getDate()-day);return d;
}
function workSummary(){
 const p=portalState();const start=weekStart();const now=Date.now();
 const sessions=p.workSessions.filter(s=>new Date(s.start)>=start);
 const mins=sessions.reduce((a,s)=>{if(s.end)return a+(s.durationMin||0);return a+Math.max(0,Math.round((now-new Date(s.start).getTime())/60000))},0);
 const h=Math.floor(mins/60),m=mins%60;
 addCapture('HEURES',`Semaine : ${h} h ${m} min`,{sessions:sessions.length,weekStart:start.toISOString()});
 toast(`Cette semaine : ${h} h ${m} min`);
 return true;
}
function addShopping(){
 directOpenSheet('noteSheet');
 const x=document.getElementById('quickNote');
 if(x&&!x.value)x.value='À acheter : ';
 return true;
}
function addTextileDosage(){
 directOpenSheet('noteSheet');
 const x=document.getElementById('quickNote');
 if(x&&!x.value)x.value='Dosage textile : surface / tissu / produit / quantité = ';
 return true;
}
function clientsRecurring(){
 clientFilter='Client';
 directNavigate('clients');
 toast('Filtre clients ouvert.');
 return true;
}
function renderModules(){
 const p=portalState();
 const tabs=document.getElementById('moduleTabs');
 if(tabs)tabs.innerHTML=Object.entries(MODULES).map(([id,m])=>`<button class="${p.activeModule===id?'active':''}" data-module="${id}"><span>${m.icon}</span><b>${m.label}</b></button>`).join('');
 const box=document.getElementById('modulePanel');
 if(box){
   const m=MODULES[p.activeModule]||MODULES.auto;
   const actionLabels={
    'capture.photo':'Avant / Après','job.auto.new':'Nouveau chantier',
    'job.textile.new':'Nouveau chantier','textile.dosage':'Saisir dosage',
    'job.vitres.new':'Nouveau chantier','clients.recurring':'Clients récurrents',
    'work.clock':'Pointer','work.summary':'Bilan heures',
    'capture.pocket':'Vide-poche','shopping.add':'Note course'
   };
   box.innerHTML=`<div class="module-panel-head"><div><span class="eyebrow">Module</span><h3>${m.icon} ${m.label}</h3><p>${m.desc}</p></div></div><div class="module-actions">${m.actions.map(a=>`<button class="ghost-mini" data-action="${a}">${actionLabels[a]||a}</button>`).join('')}</div>`;
 }
 const work=document.getElementById('workQuickStatus');
 if(work){
   const open=p.workSessions.find(s=>!s.end);const start=weekStart();
   const mins=p.workSessions.filter(s=>new Date(s.start)>=start).reduce((a,s)=>a+(s.durationMin||0),0);
   work.textContent=open?'Pointage en cours':`${Math.floor(mins/60)} h ${mins%60} min cette semaine`;
 }
 const jobs=document.getElementById('jobsQuickStatus');
 if(jobs)jobs.textContent=`${p.jobs.length} chantier${p.jobs.length>1?'s':''} local${p.jobs.length>1?'aux':''}`;
}
registerAction('job.auto.new',{label:'Nouveau chantier Auto',handler:()=>{setActiveModule('auto');addJob('AUTO');return true}});
registerAction('job.textile.new',{label:'Nouveau chantier Textile',handler:()=>{setActiveModule('textile');addJob('TEXTILE');return true}});
registerAction('job.vitres.new',{label:'Nouveau chantier Vitres',handler:()=>{setActiveModule('vitres');addJob('VITRES');return true}});
registerAction('textile.dosage',{label:'Dosage Textile',handler:()=>addTextileDosage()});
registerAction('clients.recurring',{label:'Clients récurrents',handler:()=>clientsRecurring()});
registerAction('work.clock',{label:'Pointage salarié',handler:()=>clockWork()});
registerAction('work.summary',{label:'Bilan heures',handler:()=>workSummary()});
registerAction('shopping.add',{label:'Ajouter course',handler:()=>addShopping()});
window.MADYCLEAR_MODULES={set:setActiveModule,list:MODULES,clock:clockWork,summary:workSummary};



// V1.8.1 Patch — Liens directs simples sans API
const MADYCLEAR_DIRECT_LINKS = {
  "whatsapp": {
    "label": "Ouvrir WhatsApp",
    "url": "https://wa.me/?text=Bonjour%2C%20je%20vous%20contacte%20depuis%20MADYCLEAR.",
    "status": "ACCÈS DIRECT"
  },
  "calendar": {
    "label": "Créer un RDV Google Calendar",
    "url": "https://calendar.google.com/calendar/u/0/r/eventedit?text=RDV%20MADYCLEAR&details=Rendez-vous%20MADYCLEAR%20%C3%A0%20compl%C3%A9ter.",
    "status": "ACCÈS DIRECT"
  },
  "drive": {
    "label": "Ouvrir Google Drive",
    "url": "https://drive.google.com/drive/my-drive",
    "status": "ACCÈS DIRECT"
  },
  "gmail": {
    "label": "Ouvrir Gmail",
    "url": "https://mail.google.com/mail/u/0/#inbox",
    "status": "ACCÈS DIRECT"
  },
  "weather": {
    "label": "Ouvrir Météo Martinique",
    "url": "https://meteofrance.mq/fr",
    "status": "ACCÈS DIRECT"
  },
  "supabase": {
    "label": "Ouvrir Supabase",
    "url": "https://supabase.com/dashboard/projects",
    "status": "ACCÈS DIRECT"
  },
  "n8n": {
    "label": "Ouvrir n8n",
    "url": "https://app.n8n.cloud/",
    "status": "ACCÈS DIRECT"
  }
};
function openDirectService(id){
  const item = MADYCLEAR_DIRECT_LINKS[id];
  if(!item){
    toast('Lien non configuré');
    return false;
  }
  try{
    recordCoreEvent('direct_link_opened', {service:id,label:item.label,url:item.url}, 'VALIDATION');
  }catch(e){}
  window.open(item.url, '_blank', 'noopener,noreferrer');
  toast(item.label);
  return true;
}

// V1.8 — Vue opérationnelle + connecteurs à brancher
const OPERATIONAL_FEATURES=[
 {id:'crm',label:'CRM Clients',detail:'Ajout, édition, relances, WhatsApp direct',action:'home.crm'},
 {id:'quotes',label:'Devis MADYCLEAR',detail:'Auto, Textile, Vitres, Pros',action:'home.quotes'},
 {id:'notes',label:'Notes & captures',detail:'Notes rapides, portail Pro/Perso',action:'home.notes'},
 {id:'projects',label:'Projets',detail:'Suivi local et priorités',action:'home.projects'},
 {id:'work',label:'Suivi salarié',detail:'Pointage et bilan hebdomadaire',action:'home.work'},
 {id:'backup',label:'Sauvegarde',detail:'Export/import et données locales',action:'home.backup'},
 {id:'actions',label:'Action Engine',detail:'Actions, macros, journal',action:'home.actions'},
 {id:'photos',label:'Photos chantier',detail:'Ouvrir la caméra / sélectionner une photo',action:'home.photos'}
];
const CONNECTORS_TO_ATTACH=[
 {id:'n8n',label:'n8n',detail:'Orchestrateur central / webhooks',next:'Configurer le webhook Core puis tester une synchronisation.'},
 {id:'supabase',label:'Supabase',detail:'Synchronisation multi-appareils / base centrale',next:'Créer/relier le projet Supabase et ses tables métier.'},
 {id:'gmail',label:'Gmail',detail:'Lecture, classement, brouillons',next:'Autoriser Gmail puis relier les workflows via n8n.'},
 {id:'calendar',label:'Google Calendar',detail:'Rendez-vous et planning',next:'Autoriser Calendar puis relier rendez-vous et rappels.'},
 {id:'drive',label:'Google Drive',detail:'Photos, devis et documents',next:'Autoriser Drive et choisir les dossiers MADYCLEAR.'},
 {id:'weather',label:'Météo',detail:'Planification Vitres / déplacements',next:'Brancher une source météo au module Vitres.'},
 {id:'whatsapp',label:'WhatsApp Business',detail:'Messages automatisés et notifications',next:'Relier l’API officielle WhatsApp Business après validation.'}
];
function migratePreparedConnectors(){
 state.core.connectorStatus=state.core.connectorStatus||{};
 const preparedIds=new Set(
  (state.core.queue||[])
   .filter(e=>e.event_type==='connector_prepare'&&e.payload?.connector)
   .map(e=>e.payload.connector)
 );
 preparedIds.forEach(id=>{
  const current=state.core.connectorStatus[id]?.state||'TO_CONNECT';
  if(current!=='CONNECTED')state.core.connectorStatus[id]={...(state.core.connectorStatus[id]||{}),state:'PREPARED'};
 });
}
function connectorState(id){
 const cs=state.core.connectorStatus||{};
 return cs[id]?.state||'TO_CONNECT';
}

let activeConnectorId='';
function scrollHomeTarget(id){
 const el=document.getElementById(id);
 if(el){try{el.scrollIntoView({behavior:'smooth',block:'start'})}catch(e){el.scrollIntoView()}return true}
 return false;
}
function openHomeModule(id){
 directNavigate('home');
 setActiveModule(id);
 setTimeout(()=>scrollHomeTarget('moduleHub'),60);
 return true;
}
function openConnectorInfo(id){
 const c=CONNECTORS_TO_ATTACH.find(x=>x.id===id);
 if(!c)throw new Error('Connecteur inconnu');
 activeConnectorId=id;
 const s=connectorState(id);
 const stateLabel=s==='CONNECTED'?'API CONNECTÉE':s==='PREPARED'?'API PRÉPARÉE':'API À BRANCHER';
 const title=document.getElementById('connectorTitle');
 const detail=document.getElementById('connectorDetail');
 const status=document.getElementById('connectorStatusText');
 const next=document.getElementById('connectorNext');
 const openBtn=document.getElementById('connectorOpenDirect');
 const prepBtn=document.getElementById('connectorPrepareBtn');
 if(title)title.textContent=c.label;
 if(detail)detail.textContent=c.detail;
 if(status)status.textContent=`ACCÈS DIRECT DISPONIBLE • ${stateLabel}`;
 if(next)next.textContent=c.next||'Branchement à préparer.';
 if(openBtn){
   openBtn.textContent=`Ouvrir ${c.label}`;
   openBtn.dataset.action=`direct.${id}`;
 }
 if(prepBtn){
   prepBtn.textContent=s==='CONNECTED'?'API connectée':s==='PREPARED'?'API déjà préparée':'Préparer l’API';
   prepBtn.disabled=s==='CONNECTED'||s==='PREPARED';
 }
 directOpenSheet('connectorSheet');
 return true;
}
function prepareConnector(id=activeConnectorId){
 const c=CONNECTORS_TO_ATTACH.find(x=>x.id===id);
 if(!c)return false;
 const current=connectorState(id);
 if(current==='CONNECTED'){toast(`${c.label} est déjà connecté.`);return true}
 if(current==='PREPARED'){toast(`${c.label} est déjà préparé.`);openConnectorInfo(id);return true}
 recordCoreEvent('connector_prepare',{title:`Préparer ${c.label}`,detail:c.next||c.detail,connector:id},'VALIDATION');
 state.core.connectorStatus=state.core.connectorStatus||{};
 state.core.connectorStatus[id]={...(state.core.connectorStatus[id]||{}),state:'PREPARED'};
 persist();renderCore();renderOperationalFocus();openConnectorInfo(id);
 toast(`${c.label} préparé pour le futur branchement API.`);
 return true;
}
registerAction('home.crm',{label:'CRM Clients',handler:()=>directNavigate('clients')});
registerAction('home.quotes',{label:'Devis MADYCLEAR',handler:()=>directNavigate('mady')});
registerAction('home.notes',{label:'Notes & captures',handler:()=>directOpenSheet('noteSheet')});
registerAction('home.projects',{label:'Projets',handler:()=>directNavigate('projects')});
registerAction('home.work',{label:'Suivi salarié',handler:()=>openHomeModule('salarie')});
registerAction('home.backup',{label:'Sauvegarde',handler:()=>directOpenSheet('backupSheet')});
registerAction('home.actions',{label:'Action Engine',handler:()=>directOpenSheet('coreSheet')});
registerAction('home.photos',{label:'Photos chantier',handler:()=>openPhotoCapture()});
registerAction('home.goal',{label:'Objectif MADYCLEAR',handler:()=>directOpenSheet('goalSheet')});
registerAction('connector.show',{label:'Voir connecteur',log:false,handler:ctx=>openConnectorInfo(ctx.connectorId)});
registerAction('connector.prepare',{label:'Préparer un branchement',handler:ctx=>prepareConnector(ctx.connectorId||activeConnectorId)});

function renderOperationalFocus(){
 const ops=document.getElementById('operationalList');
 if(ops)ops.innerHTML=OPERATIONAL_FEATURES.map(x=>`
  <button type="button" class="ops-row ops-button" data-action="${x.action}" aria-label="Ouvrir ${esc(x.label)}">
    <span class="ops-dot ok"></span>
    <div><strong>${esc(x.label)}</strong><small>${esc(x.detail)}</small></div>
    <span class="ops-tail"><span class="ops-state">OPÉRATIONNEL</span><b>›</b></span>
  </button>`).join('');

 const con=document.getElementById('connectorList');
 if(con)con.innerHTML=CONNECTORS_TO_ATTACH.map(x=>{
   const s=connectorState(x.id);
   const connected=s==='CONNECTED',prepared=s==='PREPARED';
   const label=connected?'CONNECTÉ':prepared?'PRÉPARÉ':'À BRANCHER';
   return `<button type="button" class="ops-row ops-button" data-action="connector.show" data-connector-id="${x.id}" aria-label="Voir ${esc(x.label)}">
    <span class="ops-dot ${connected?'ok':prepared?'ready':'wait'}"></span>
    <div><strong>${esc(x.label)}</strong><small>${esc(x.detail)} • accès direct disponible</small></div>
    <span class="ops-tail"><span class="ops-state ${connected?'connected':prepared?'prepared':'waiting'}">${label}</span><b>›</b></span>
   </button>`;
 }).join('');

 const sum=document.getElementById('opsSummary');
 if(sum){
   const connected=CONNECTORS_TO_ATTACH.filter(x=>connectorState(x.id)==='CONNECTED').length;
   const prepared=CONNECTORS_TO_ATTACH.filter(x=>connectorState(x.id)==='PREPARED').length;
   sum.textContent=`${OPERATIONAL_FEATURES.length} fonctions opérationnelles • ${prepared} API préparées • ${connected} connectées`;
 }
}

// KeepConnected Bridge V1.7
// PWA = surveillance opportuniste. La persistance H24 réelle nécessitera le compagnon Android natif.
function kcState(){
 return state.core.keepConnected||(state.core.keepConnected={
  mode:'PWA',network:navigator.onLine?'ONLINE':'OFFLINE',lastHeartbeat:'',lastResume:'',
  retryQueue:[],triggers:[],androidBridge:false
 });
}
function kcRunTriggers(reason='timer'){
 const k=kcState();const now=Date.now();
 k.triggers.filter(t=>t.enabled).forEach(t=>{
  if(t.type==='TIME'&&reason==='timer'){
   const every=Math.max(15,Number(t.config?.intervalMinutes||60))*60000;
   const last=t.lastRun?new Date(t.lastRun).getTime():0;
   if(!last||now-last>=every){t.lastRun=new Date().toISOString();runAction('scan.priorities',{trigger:t.id}).catch(()=>{});}
  }
  if(t.type==='NETWORK'&&['online','offline'].includes(reason)){
   t.lastRun=new Date().toISOString();addActivity('AUTO','Trigger réseau',reason==='online'?'Connexion rétablie':'Connexion perdue');
  }
 });
}
function kcHeartbeat(reason='timer'){
 const k=kcState();
 k.network=navigator.onLine?'ONLINE':'OFFLINE';
 k.lastHeartbeat=coreNow();
 if(reason==='resume')k.lastResume=coreNow();
 if(['manual','startup','online','offline'].includes(reason))addActivity('AUTO','KeepConnected heartbeat',`${k.network} • ${reason}`);
 kcRunTriggers(reason);
 if(navigator.onLine)kcFlushRetryQueue();
 persist();renderKeepConnected();
}
function kcQueue(action){
 const k=kcState();
 k.retryQueue.push({id:uid(),createdAt:new Date().toISOString(),attempts:0,...action});
 persist();renderKeepConnected();
}
async function kcFlushRetryQueue(){
 const k=kcState();
 if(!navigator.onLine||!k.retryQueue.length)return;
 const remain=[];
 for(const item of k.retryQueue){
  try{
   if(item.actionId) await runAction(item.actionId,{...(item.context||{}),retry:true});
   else throw new Error('Action de reprise absente');
  }catch(err){
   item.attempts=(item.attempts||0)+1;
   item.lastError=String(err?.message||err);
   if(item.attempts<5)remain.push(item);
  }
 }
 k.retryQueue=remain;persist();renderKeepConnected();
}
function kcAddTrigger(type,label,config={}){
 const k=kcState();
 const t={id:uid(),type,label,enabled:true,createdAt:new Date().toISOString(),config};
 k.triggers.push(t);persist();renderKeepConnected();return t;
}
function kcRemoveTrigger(id){
 const k=kcState();k.triggers=k.triggers.filter(t=>t.id!==id);persist();renderKeepConnected();
}
function renderKeepConnected(){
 const k=kcState();
 const el=document.getElementById('kcSummary');
 if(el)el.textContent=`${k.mode} • ${k.network} • ${k.retryQueue.length} reprise${k.retryQueue.length>1?'s':''} • ${k.triggers.filter(t=>t.enabled).length} trigger${k.triggers.filter(t=>t.enabled).length>1?'s':''}`;
 const hb=document.getElementById('kcHeartbeat');if(hb)hb.textContent=k.lastHeartbeat?`Dernier heartbeat : ${k.lastHeartbeat}`:'Heartbeat en attente';
 const badge=document.getElementById('kcModeBadge');if(badge)badge.textContent=k.androidBridge?'ANDROID H24':'PWA ACTIF';
 const list=document.getElementById('kcTriggers');
 if(list)list.innerHTML=k.triggers.length?k.triggers.map(t=>`<div class="activity-row"><span class="activity-badge AUTO">${t.type}</span><div><strong>${esc(t.label)}</strong><small>${t.enabled?'Actif':'Inactif'}</small></div><button class="ghost-mini" data-kc-remove="${t.id}">Suppr.</button></div>`).join(''):'<p class="empty">Aucun déclencheur personnalisé.</p>';
}
window.addEventListener('online',()=>{kcState().network='ONLINE';addActivity('AUTO','Réseau rétabli','Reprise de la file en attente.');kcHeartbeat('online')});
window.addEventListener('offline',()=>{kcState().network='OFFLINE';addActivity('VALIDATION','Réseau indisponible','Les événements Core restent stockés localement.');kcHeartbeat('offline')});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')kcHeartbeat('resume')});
window.addEventListener('focus',()=>kcHeartbeat('focus'));
setInterval(()=>{if(document.visibilityState==='visible')kcRunTriggers('timer')},60*1000);
setInterval(()=>{if(document.visibilityState==='visible')kcHeartbeat('timer')},15*60*1000);
registerAction('kc.heartbeat',{label:'Heartbeat KeepConnected',handler:()=>{kcHeartbeat('manual');return true}});
registerAction('kc.retry',{label:'Reprendre les actions en attente',handler:()=>kcFlushRetryQueue()});
registerAction('kc.trigger.hourly',{label:'Ajouter trigger horaire',handler:()=>{kcAddTrigger('TIME','Contrôle horaire',{intervalMinutes:60});return true}});
registerAction('kc.trigger.network',{label:'Ajouter trigger réseau',handler:()=>{kcAddTrigger('NETWORK','Changement de connexion',{event:'online/offline'});return true}});
window.MADYCLEAR_KEEP_CONNECTED={heartbeat:kcHeartbeat,queue:kcQueue,flush:kcFlushRetryQueue,addTrigger:kcAddTrigger,removeTrigger:kcRemoveTrigger,state:kcState};

function localAutopilot(force=false){
 const now=new Date();const slot=`${now.toISOString().slice(0,13)}`;
 if(!force&&state.core.lastAutopilot===slot)return;
 const dueList=state.contacts.filter(due);const hot=state.contacts.filter(c=>c.priority==='Haute'&&!['Gagné','Perdu','Client'].includes(c.status));
 state.core.lastAutopilot=slot;
 recordCoreEvent('hourly_scan',{title:'Scan automatique',detail:`${dueList.length} relance(s) due(s) • ${hot.length} prospect(s) haute priorité • ${state.projects.length} projet(s) suivi(s).`,due:dueList.map(c=>c.id),hot:hot.map(c=>c.id)},'AUTO');
 persist();renderCore();
}
async function syncCore({silent=false}={}){
 const endpoint=String(state.core.endpoint||'').trim();
 if(!endpoint){state.core.health='LOCAL';persist();renderCore();if(!silent)toast('Core distant non configuré : mode local actif.');return false}
 if(!navigator.onLine){state.core.health='DEGRADED';persist();renderCore();if(!silent)toast('Réseau indisponible. Les événements restent en file.');return false}
 const pending=state.core.queue.filter(e=>e.remoteStatus==='QUEUED');
 try{
  for(const event of pending){
   const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({source:event.source,event_type:event.event_type,external_id:event.id,occurred_at:event.occurred_at,autonomy_hint:event.severity,payload:event.payload})});
   if(!r.ok)throw new Error(`HTTP ${r.status}`);event.remoteStatus='SYNCED';event.syncedAt=coreNow();
  }
  state.core.health='ONLINE';state.core.lastSync=coreNow();addActivity('AUTO','Synchronisation Core',pending.length?`${pending.length} événement(s) envoyé(s).`:'Core joignable • rien à synchroniser.');persist();renderCore();if(!silent)toast('Core synchronisé.');return true;
 }catch(err){state.core.health='DEGRADED';addActivity('VALIDATION','Synchronisation en attente',`Connexion Core impossible : ${err.message}`);persist();renderCore();if(!silent)toast('Core distant inaccessible. Mode local maintenu.');return false}
}
function coreStatus(){
 const critical=state.core.alerts.filter(a=>!a.acknowledged).length;
 if(critical)return {key:'CRITICAL',label:'CRITIQUE',cls:'critical'};
 if(state.core.health==='DEGRADED')return {key:'DEGRADED',label:'DÉGRADÉ',cls:'degraded'};
 if(state.core.endpoint&&state.core.health==='ONLINE')return {key:'ONLINE',label:'EN LIGNE',cls:'online'};
 return {key:'LOCAL',label:'LOCAL',cls:'local'};
}
function fmtCoreDate(d){if(!d)return 'locale';try{return new Date(d).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'})}catch{return d}}
function renderCore(){
 if(!state.core)return;const st=coreStatus();const today=TODAY();
 const autoToday=state.core.activity.filter(a=>a.level==='AUTO'&&String(a.date).slice(0,10)===today).length;
 const validations=state.core.validations.filter(v=>v.status==='PENDING');const critical=state.core.alerts.filter(a=>!a.acknowledged);const queued=state.core.queue.filter(e=>e.remoteStatus==='QUEUED').length;
 const badge=document.getElementById('coreHealthBadge');if(badge){badge.textContent=st.label;badge.className=`core-badge ${st.cls}`}
 const sb=document.getElementById('coreSheetStatus');if(sb){sb.textContent=st.label;sb.className=`core-badge ${st.cls}`}
 document.getElementById('coreAutoCount').textContent=autoToday;document.getElementById('coreValidationCount').textContent=validations.length;document.getElementById('coreCriticalCount').textContent=critical.length;document.getElementById('coreQueueCount').textContent=queued;
 document.getElementById('coreLastSync').textContent=`Dernière synchro : ${fmtCoreDate(state.core.lastSync)}`;
 document.getElementById('coreSummary').textContent=st.key==='ONLINE'?'Core connecté : le cockpit peut transmettre ses événements au système nerveux.':st.key==='DEGRADED'?'Connexion distante indisponible : le cockpit continue en local sans perdre les événements.':st.key==='CRITICAL'?'Une alerte critique nécessite ton attention.':'Mode local-first actif : automatisations sûres et journal fonctionnent déjà sur cet appareil.';
 const title=document.getElementById('coreSheetTitle');if(title)title.textContent=st.key==='ONLINE'?'Core distant connecté':'Mode local-first actif';
 const text=document.getElementById('coreSheetText');if(text)text.textContent=state.core.endpoint?'Le webhook est configuré. Les événements AUTO restent utilisables localement et sont synchronisés quand la connexion répond.':'Aucun webhook distant configuré. Le cockpit reste autonome localement ; n8n/Gmail/Drive seront branchés sans modifier le CRM.';
 const preview=document.getElementById('coreActivityPreview');if(preview)preview.innerHTML=state.core.activity.slice(0,2).map(activityRow).join('')||'<div class="activity-row"><span class="activity-dot"></span><div class="activity-copy"><strong>Core prêt</strong><small>Le premier scan automatique s’exécutera dans ce cockpit.</small></div></div>';
 const activity=document.getElementById('coreActivity');if(activity)activity.innerHTML=state.core.activity.slice(0,30).map(a=>`<div class="core-log-card"><strong>${esc(a.title)}</strong><p>${esc(a.detail)}</p><small>${esc(a.level)} • ${fmtCoreDate(a.date)}</small></div>`).join('')||'<div class="core-log-card"><strong>Aucune activité</strong><p>Le journal se remplira automatiquement.</p></div>';
 const vals=document.getElementById('coreValidations');if(vals)vals.innerHTML=validations.map(v=>`<div class="validation-card"><strong>${esc(v.title)}</strong><p>${esc(v.reason)}</p><small>${fmtCoreDate(v.date)}</small><div class="validation-actions"><button class="approve" data-core-approve="${esc(v.id)}">Approuver</button><button class="reject" data-core-reject="${esc(v.id)}">Refuser</button></div></div>`).join('')||'<div class="core-log-card"><strong>Rien à valider</strong><p>Les actions sûres continuent automatiquement.</p></div>';
 const channels=document.getElementById('coreChannels');if(channels)channels.innerHTML=state.core.channels.map(c=>{let label='À BRANCHER',cls='';if(c.id==='cockpit'){label='ACTIF';cls='online'}else if(c.id==='whatsapp'){label='DIRECT';cls='online'}else if(c.id==='n8n'&&state.core.endpoint){label=state.core.health==='ONLINE'?'CONNECTÉ':'CONFIGURÉ';cls=state.core.health==='ONLINE'?'online':''}return `<div class="channel-row"><div><strong>${esc(c.name)}</strong><small>${esc(c.detail)}</small></div><span class="channel-state ${cls}">${label}</span></div>`}).join('');
 const actionSummary=document.getElementById('actionEngineSummary');if(actionSummary){const s=actionStats();actionSummary.textContent=`${ACTION_REGISTRY.size} actions • ${s.success} succès • ${s.failed} échec${s.failed>1?'s':''}${s.lastAction?` • dernier : ${s.lastAction}`:''}`;}
 const endpoint=document.getElementById('coreEndpoint');if(endpoint&&document.activeElement!==endpoint)endpoint.value=state.core.endpoint||'';const auto=document.getElementById('coreAutoSync');if(auto&&document.activeElement!==auto)auto.checked=!!state.core.autoSync;
}
function activityRow(a){const cls=a.level==='CRITIQUE'?'critical':a.level==='VALIDATION'?'validation':'';return `<div class="activity-row"><span class="activity-dot ${cls}"></span><div class="activity-copy"><strong>${esc(a.title)}</strong><small>${esc(a.detail)} • ${fmtCoreDate(a.date)}</small></div></div>`}
function approveValidation(id,approved){const v=state.core.validations.find(x=>x.id===id);if(!v)return;v.status=approved?'APPROVED':'REJECTED';recordCoreEvent(approved?'validation_approved':'validation_rejected',{title:approved?'Action approuvée':'Action refusée',detail:v.title,validationId:id},'AUTO');persist();renderAll();toast(approved?'Validation approuvée.':'Action refusée.')}

function nav(name,context={}){return runAction(`nav.${name}`,context)}
document.addEventListener('click',e=>{
 const mt=e.target.closest('[data-module]');if(mt){e.preventDefault();setActiveModule(mt.dataset.module);return}
 const pm=e.target.closest('[data-portal-mode]');if(pm){e.preventDefault();setPortalMode(pm.dataset.portalMode);return}
 const actionBtn=e.target.closest('[data-action]');
 if(actionBtn){
  e.preventDefault();
  runAction(actionBtn.dataset.action,{source:'button',connectorId:actionBtn.dataset.connectorId||'',moduleId:actionBtn.dataset.moduleId||'',target:actionBtn.dataset.target||''});
  return
 }
 const n=e.target.closest('[data-nav]');
 if(n){e.preventDefault();nav(n.dataset.nav,{clientFilter:n.dataset.clientFilter||''})}
 const o=e.target.closest('[data-open]');
 if(o){e.preventDefault();runAction(`sheet.${o.dataset.open}`,{source:'button'})}
 const kr=e.target.closest('[data-kc-remove]');if(kr){e.preventDefault();kcRemoveTrigger(kr.dataset.kcRemove);return}
 const ok=e.target.closest('[data-core-approve]');if(ok)approveValidation(ok.dataset.coreApprove,true);
 const no=e.target.closest('[data-core-reject]');if(no)approveValidation(no.dataset.coreReject,false)
});
function openSheet(id){return runAction(`sheet.${id}`,{source:'legacy'})}
function closeSheets(){document.getElementById('overlay').classList.add('hidden');document.querySelectorAll('.sheet.open').forEach(s=>{s.classList.remove('open');s.setAttribute('aria-hidden','true')})}
document.getElementById('overlay').onclick=closeSheets;document.querySelectorAll('.close-sheet').forEach(b=>b.onclick=closeSheets);

function due(c){return c.followup&&c.followup<=TODAY()&&!['Gagné','Perdu'].includes(c.status)}
function pipeline(){return state.contacts.filter(c=>!['Gagné','Perdu','Client'].includes(c.status)).reduce((s,c)=>s+Number(c.value||0),0)}
function renderHome(){const {monthlyGoal,monthlyCA,avgBasket}=state.settings;const pct=monthlyGoal?Math.min(100,monthlyCA/monthlyGoal*100):0;document.getElementById('goalTitle').textContent=`${money(monthlyGoal).replace(',00','')} / mois`;document.getElementById('goalCA').textContent=money(monthlyCA).replace(',00','');document.getElementById('goalRemaining').textContent=money(Math.max(0,monthlyGoal-monthlyCA)).replace(',00','');document.getElementById('clientsNeeded').textContent=Math.ceil(Math.max(0,monthlyGoal-monthlyCA)/Math.max(1,avgBasket));document.getElementById('goalProgress').style.width=`${pct}%`;const d=state.contacts.filter(due);document.getElementById('metricRelances').textContent=d.length;document.getElementById('metricPipeline').textContent=money(pipeline()).replace(',00','');document.getElementById('metricProjects').textContent=state.projects.length;const badge=document.getElementById('navDue');badge.textContent=d.length;badge.classList.toggle('hidden',!d.length);if(d.length){document.getElementById('focusTitle').textContent=`${d.length} relance${d.length>1?'s':''} à traiter`;document.getElementById('focusText').textContent=`Commence par ${d[0].name} : ${d[0].next||'reprendre contact'}.`;}else{const next=state.projects.slice().sort((a,b)=>a.progress-b.progress)[0];document.getElementById('focusTitle').textContent='Prochain mouvement';document.getElementById('focusText').textContent=next?`${next.name} — ${next.next}`:'Aucun projet actif : ajoute une prochaine action ou un projet.';}document.getElementById('homeProjects').innerHTML=state.projects.map(p=>`<button class="project-mini" data-nav="projects"><span class="chip ${p.tone==='gold'?'waiting':''}">${esc(p.status)}</span><h3>${esc(p.name)}</h3><p>${esc(p.next)}</p><div class="mini-progress"><i style="width:${p.progress}%"></i></div></button>`).join('');renderCore()}

function renderQuote(){const tab=state.quote.tab;document.querySelectorAll('[data-quote-tab]').forEach(b=>b.classList.toggle('active',b.dataset.quoteTab===tab));document.getElementById('quoteItems').innerHTML=pricing[tab].map(x=>{const q=state.quote.qty[x.id]||0;return `<div class="service-item"><div><h3>${esc(x.name)}</h3><p>${esc(x.detail)}${x.sap?' • SAP potentiel':''}</p><div class="price">${x.price?money(x.price).replace(',00',''):'Sur devis'}</div></div>${x.price?`<div class="stepper"><button data-step="-1" data-id="${x.id}">−</button><span>${q}</span><button data-step="1" data-id="${x.id}">＋</button></div>`:'<span class="tag">Devis</span>'}</div>`}).join('');calcQuote();renderQuoteHistory()}
document.getElementById('quoteTabs').onclick=e=>{const b=e.target.closest('[data-quote-tab]');if(!b)return;state.quote.tab=b.dataset.quoteTab;state.quote.qty={};save()};document.getElementById('quoteItems').onclick=e=>{const b=e.target.closest('[data-step]');if(!b)return;const id=b.dataset.id;state.quote.qty[id]=Math.max(0,(state.quote.qty[id]||0)+Number(b.dataset.step));save()};
function calcQuote(){let total=0,sap=0,labels=[];Object.entries(state.quote.qty).forEach(([id,q])=>{const x=Object.values(pricing).flat().find(y=>y.id===id);if(!x||!q)return;total+=x.price*q;if(x.sap)sap+=x.price*q;labels.push(`${q}× ${x.name}`)});const net=(total-sap)+(sap/2);document.getElementById('quoteTotal').textContent=money(total).replace(',00','');document.getElementById('quoteSap').textContent=money(sap).replace(',00','');document.getElementById('quoteNet').textContent=money(net).replace(',00','');document.getElementById('quoteNote').textContent=total?`${labels.join(' • ')}. *Estimation SAP uniquement après activation et éligibilité.`:'Ajoute une prestation pour commencer.';return{total,sap,net,labels}}
document.getElementById('clearQuote').onclick=()=>{state.quote.qty={};save()};document.getElementById('saveQuote').onclick=()=>{const q=calcQuote();if(!q.total)return toast('Ajoute au moins une prestation.');const quote={id:uid(),date:new Date().toISOString(),tab:state.quote.tab,total:q.total,sap:q.sap,net:q.net,labels:q.labels};state.quotes.unshift(quote);state.quotes=state.quotes.slice(0,30);state.quote.qty={};recordCoreEvent('quote_saved',{title:'Devis enregistré',detail:`${q.total} € • ${q.labels.join(', ')}`,quoteId:quote.id,total:q.total},'AUTO');save();toast('Devis brouillon enregistré.')} 
function quoteMessage(){const q=calcQuote();const label=q.labels.length?q.labels.join(', '):'prestation à préciser';return `Bonjour, voici l'estimation MADYCLEAR : ${label}. Total public estimé : ${money(q.total).replace(',00','')}. Reste à charge indicatif après crédit d'impôt potentiel : ${money(q.net).replace(',00','')} si la prestation est éligible SAP. Pouvez-vous m'envoyer quelques photos pour confirmer le devis ?`}
document.getElementById('quoteWhatsApp').onclick=()=>openWA(WA_NUMBER,quoteMessage());document.getElementById('photosWhatsApp').onclick=()=>openWA(WA_NUMBER,`Bonjour, pour confirmer votre devis MADYCLEAR, pouvez-vous envoyer quelques photos de l'élément à nettoyer, avec une photo large et une photo des taches principales ?`);
function renderQuoteHistory(){const el=document.getElementById('quoteHistory');if(!state.quotes.length){el.innerHTML='<div class="history-card"><strong>Aucun devis enregistré</strong><p>Les brouillons resteront ici, sur cet appareil.</p></div>';return}el.innerHTML=state.quotes.slice(0,6).map(q=>`<div class="history-card"><strong>${money(q.total).replace(',00','')} • ${esc(q.labels.join(', '))}</strong><small>${new Date(q.date).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'})}</small><p>Reste estimé : ${money(q.net).replace(',00','')} • part SAP potentielle : ${money(q.sap).replace(',00','')}</p></div>`).join('')}

function renderClients(){const q=document.getElementById('clientSearch').value.trim().toLowerCase();let list=state.contacts.filter(c=>[c.name,c.segment,c.commune,c.phone,c.email,c.status,c.next,c.notes].join(' ').toLowerCase().includes(q));if(clientFilter==='À relancer')list=list.filter(due);else if(clientFilter==='Prospect')list=list.filter(c=>['Prospect','À contacter','Relance','Devis envoyé','RDV'].includes(c.status));else if(clientFilter==='Client')list=list.filter(c=>['Client','Gagné'].includes(c.status));else if(clientFilter==='Haute')list=list.filter(c=>c.priority==='Haute');list.sort((a,b)=>(due(b)-due(a))||({Haute:0,Moyenne:1,Basse:2}[a.priority]-({Haute:0,Moyenne:1,Basse:2}[b.priority]))||a.name.localeCompare(b.name));document.getElementById('clientList').innerHTML=list.length?list.map(contactCard).join(''):'<div class="history-card"><strong>Aucun résultat.</strong><p>Change le filtre ou ajoute un contact.</p></div>';document.getElementById('crmCount').textContent=state.contacts.length;document.getElementById('crmDue').textContent=state.contacts.filter(due).length;document.getElementById('crmValue').textContent=money(pipeline()).replace(',00','');document.querySelectorAll('#clientFilters button').forEach(b=>b.classList.toggle('active',b.dataset.filter===clientFilter))}
function contactCard(c){const pc=c.priority==='Haute'?'high':c.priority==='Basse'?'low':'medium';const phone=normalizePhone(c.phone);const relance=`Bonjour ${c.name||''}, c'est MADYCLEAR. Je reviens vers vous concernant votre demande. Est-ce toujours d'actualité ?`;const photos=`Bonjour ${c.name||''}, pour confirmer le devis MADYCLEAR, pouvez-vous m'envoyer quelques photos de l'élément à nettoyer et de son état général ?`;const rdv=`Bonjour ${c.name||''}, je vous confirme notre échange MADYCLEAR. Dites-moi le créneau qui vous arrange pour organiser l'intervention.`;return `<article class="contact-card"><div class="contact-top"><div><h3>${esc(c.name)}</h3><div class="contact-sub">${esc(c.segment||'Contact')} ${c.commune?'• '+esc(c.commune):''}</div></div><i class="priority ${pc}"></i></div><div class="contact-meta"><span class="tag">${esc(c.status)}</span><span class="tag">${esc(c.priority)}</span>${c.value?`<span class="tag">${money(c.value).replace(',00','')}</span>`:''}${due(c)?'<span class="tag due">Relance due</span>':''}</div><div class="contact-next"><b>Prochaine action :</b> ${esc(c.next||'À définir')}${c.followup?`<br><b>Date :</b> ${new Date(c.followup+'T12:00:00').toLocaleDateString('fr-FR')}`:''}</div><div class="contact-actions">${c.phone?`<a href="tel:${esc(c.phone)}">Appeler</a><a class="wa-fast" href="${waUrl(c.phone,photos)}" target="_blank" rel="noopener">Photos</a><a class="wa-fast" href="${waUrl(c.phone,relance)}" target="_blank" rel="noopener">Relance</a><a class="wa-fast" href="${waUrl(c.phone,rdv)}" target="_blank" rel="noopener">RDV</a>`:'<button disabled>Sans tél.</button><button disabled>Photos</button><button disabled>Relance</button>'}<button data-edit-contact="${esc(c.id)}">Fiche</button></div></article>`}
document.getElementById('clientSearch').oninput=renderClients;document.getElementById('clientFilters').onclick=e=>{const b=e.target.closest('[data-filter]');if(!b)return;clientFilter=b.dataset.filter;renderClients()};document.getElementById('addContactBtn').onclick=()=>editContact();document.getElementById('clientList').onclick=e=>{const b=e.target.closest('[data-edit-contact]');if(b)editContact(b.dataset.editContact)};
function editContact(id){const c=id?state.contacts.find(x=>x.id===id):null;document.getElementById('contactSheetTitle').textContent=c?'Fiche contact':'Nouveau contact';document.getElementById('contactId').value=c?.id||'';document.getElementById('contactName').value=c?.name||'';document.getElementById('contactSegment').value=c?.segment||'';document.getElementById('contactCommune').value=c?.commune||'';document.getElementById('contactPhone').value=c?.phone||'';document.getElementById('contactEmail').value=c?.email||'';document.getElementById('contactStatus').value=c?.status||'Prospect';document.getElementById('contactPriority').value=c?.priority||'Moyenne';document.getElementById('contactValue').value=c?.value||'';document.getElementById('contactSource').value=c?.source||'';document.getElementById('contactChannel').value=c?.channel||'';document.getElementById('contactFollowup').value=c?.followup||'';document.getElementById('contactAutomation').value=c?.automation||'Assistée';document.getElementById('contactNext').value=c?.next||'';document.getElementById('contactNotes').value=c?.notes||'';document.getElementById('deleteContact').classList.toggle('hidden',!c);openSheet('contactSheet')}
document.getElementById('contactForm').onsubmit=e=>{e.preventDefault();const id=document.getElementById('contactId').value||uid();const c={id,name:document.getElementById('contactName').value.trim(),segment:document.getElementById('contactSegment').value.trim(),commune:document.getElementById('contactCommune').value.trim(),phone:document.getElementById('contactPhone').value.trim(),email:document.getElementById('contactEmail').value.trim(),status:document.getElementById('contactStatus').value,priority:document.getElementById('contactPriority').value,value:Number(document.getElementById('contactValue').value||0),source:document.getElementById('contactSource').value.trim(),channel:document.getElementById('contactChannel').value,followup:document.getElementById('contactFollowup').value,automation:document.getElementById('contactAutomation').value,next:document.getElementById('contactNext').value.trim(),notes:document.getElementById('contactNotes').value.trim(),updatedAt:coreNow()};const i=state.contacts.findIndex(x=>x.id===id);if(i>=0)state.contacts[i]=c;else state.contacts.unshift(c);recordCoreEvent('contact_saved',{title:'CRM mis à jour',detail:`${c.name} • ${c.status} • ${c.next||'action à définir'}`,contactId:id},'AUTO');closeSheets();save();toast('Contact enregistré.')};document.getElementById('deleteContact').onclick=()=>{const id=document.getElementById('contactId').value;if(!id)return;if(confirm('Supprimer ce contact de l’appareil ?')){const c=state.contacts.find(x=>x.id===id);state.contacts=state.contacts.filter(c=>c.id!==id);recordCoreEvent('contact_deleted',{title:'Contact supprimé',detail:c?.name||id,contactId:id},'AUTO');closeSheets();save();toast('Contact supprimé.')}};

function renderNotes(){const el=document.getElementById('noteList');el.innerHTML=state.notes.length?state.notes.slice(0,10).map(n=>`<div class="note-card"><strong>${esc(n.project)}</strong><small>${new Date(n.date).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'})}</small><p>${esc(n.text)}</p></div>`).join(''):'<div class="note-card"><strong>La mémoire est prête.</strong><p>Utilise “Capturer” pour enregistrer une idée ou une décision sans quitter ton cockpit.</p></div>'}
document.getElementById('noteForm').onsubmit=e=>{e.preventDefault();const note={id:uid(),date:new Date().toISOString(),project:document.getElementById('noteProject').value,text:document.getElementById('quickNote').value.trim()};state.notes.unshift(note);recordCoreEvent('note_saved',{title:'Mémoire mise à jour',detail:`${note.project} • ${note.text.slice(0,90)}`,noteId:note.id},'AUTO');document.getElementById('quickNote').value='';closeSheets();save();toast('Note capturée.')};
function renderProjects(){document.getElementById('projectList').innerHTML=state.projects.map(p=>{const auto=p.id==='digistaff'?'Core V1.3 actif':p.id==='madyclear'?'Journal + CRM actifs':'Automatisation prête à brancher';return `<article class="project-card"><div class="project-card-head"><div><span class="eyebrow">${esc(p.label)}</span><h3>${esc(p.name)}</h3></div><span class="chip ${p.tone==='gold'?'waiting':''}">${esc(p.status)}</span></div><p>${projectDescription(p.id)}</p><div class="project-progress"><span style="width:${p.progress}%"></span></div><div class="project-next"><b>PROCHAINE ACTION</b><br>${esc(p.next)}<br><br><b>AUTOMATISATION</b><br>${esc(auto)}</div></article>`}).join('')}
function projectDescription(id){return {madyclear:'Entreprise pilote : site, offre, acquisition, devis et lancement terrain.',digistaff:'Moteur virtuel qui rassemble recherche, mémoire, CRM et futurs employés IA.',association:'Projet associatif et portail documentaire de Trois-Rivières.',escale:'Point de pause commercial léger à Trois-Rivières — démarche d’emplacement.'}[id]||''}

function searchDigi(){
 const raw=document.getElementById('digiSearch').value.trim();const q=raw.toLowerCase();const box=document.getElementById('digiAnswer');
 if(!q){box.innerHTML='<span class="eyebrow">Prêt</span><h2>Qu’est-ce qu’on cherche ?</h2><p>Pose une question, demande une action sûre, prépare une proposition ou lance un diagnostic.</p>';return}
 if(digiMode==='diagnostic'){
  const st=coreStatus();const d=state.contacts.filter(due);const queued=state.core.queue.filter(e=>e.remoteStatus==='QUEUED').length;const validations=state.core.validations.filter(v=>v.status==='PENDING').length;
  box.innerHTML=`<span class="eyebrow">DIAGNOSTIC</span><h2>${esc(st.label)} • cockpit opérationnel</h2><p>${d.length} relance(s) due(s), ${queued} événement(s) en file distante, ${validations} validation(s), ${state.projects.length} projet(s) suivi(s). Dernière synchro : ${esc(fmtCoreDate(state.core.lastSync))}.</p>`;addActivity('AUTO','Diagnostic DIGISTAFF',`${d.length} relances • ${queued} en file • ${validations} validations`);persist();renderCore();return
 }
 if(digiMode==='action'){
  if(q.includes('relance')){clientFilter='À relancer';nav('clients');addActivity('AUTO','Action DIGISTAFF','Vue CRM filtrée sur les relances dues.');persist();renderCore();toast('Relances affichées.');return}
  if(q.includes('scan')||q.includes('analyse')||q.includes('priorit')){localAutopilot(true);box.innerHTML='<span class="eyebrow">ACTION AUTO</span><h2>Scan exécuté</h2><p>Le cockpit a recalculé les relances dues, les prospects prioritaires et l’état des projets.</p>';return}
  if(q.includes('synchron')){syncCore();box.innerHTML='<span class="eyebrow">ACTION AUTO</span><h2>Synchronisation lancée</h2><p>Si le Core distant n’est pas encore configuré, le cockpit reste en mode local sans perte de données.</p>';return}
  if(q.includes('sauveg')){download(`MADYCLEAR-cockpit-backup-${TODAY()}.json`,JSON.stringify(state,null,2));addActivity('AUTO','Sauvegarde exportée','Export JSON demandé depuis DIGISTAFF.');persist();renderCore();return}
  box.innerHTML='<span class="eyebrow">ACTION</span><h2>Commande non destructive uniquement</h2><p>Pour l’instant : “affiche les relances”, “lance un scan”, “synchronise le Core” ou “exporte une sauvegarde”. Les autres actions restent en proposition.</p>';return
 }
 if(digiMode==='proposal'){
  recordCoreEvent('digistaff_proposal',{title:'Proposition DIGISTAFF',reason:'Commande préparée mais non exécutée automatiquement.',proposed:raw},'VALIDATION');persist();renderAll();box.innerHTML=`<span class="eyebrow">PROPOSITION</span><h2>Ajoutée à la file de validation</h2><p>${esc(raw)}</p>`;return
 }
 if(q.includes('relance')){const d=state.contacts.filter(due);box.innerHTML=`<span class="eyebrow">DIGISTAFF LOCAL</span><h2>${d.length} relance${d.length>1?'s':''} due${d.length>1?'s':''}</h2>${d.slice(0,8).map(c=>`<div class="search-result"><b>${esc(c.name)}</b><small>${esc(c.next||'Reprendre contact')} • ${esc(c.commune||'commune non renseignée')}</small></div>`).join('')||'<p>Aucune relance échue.</p>'}`;return}
 let results=[];state.contacts.forEach(c=>{const hay=[c.name,c.segment,c.commune,c.phone,c.email,c.status,c.next,c.notes,c.source,c.channel].join(' ').toLowerCase();if(hay.includes(q))results.push({type:'Contact',title:c.name,sub:`${c.status} • ${c.commune||'commune non renseignée'} • ${c.next||'action à définir'}`})});state.projects.forEach(p=>{const hay=[p.name,p.label,p.status,p.next,projectDescription(p.id)].join(' ').toLowerCase();if(hay.includes(q))results.push({type:'Projet',title:p.name,sub:`${p.status} • ${p.next}`})});Object.entries(pricing).forEach(([cat,items])=>items.forEach(x=>{if([x.name,x.detail,cat].join(' ').toLowerCase().includes(q))results.push({type:'Tarif',title:x.name,sub:`${x.price?money(x.price).replace(',00',''):'Sur devis'} • ${x.detail}`})}));state.notes.forEach(n=>{if([n.project,n.text].join(' ').toLowerCase().includes(q))results.push({type:'Note',title:n.project,sub:n.text})});
 if(!results.length){box.innerHTML=`<span class="eyebrow">DIGISTAFF LOCAL</span><h2>Aucun résultat exact</h2><p>“${esc(raw)}” n’est pas encore dans la mémoire locale. Capture l’information pour l’ajouter.</p>`;return}box.innerHTML=`<span class="eyebrow">DIGISTAFF LOCAL</span><h2>${results.length} résultat${results.length>1?'s':''}</h2><p>Recherche effectuée dans la mémoire du cockpit.</p>${results.slice(0,12).map(r=>`<div class="search-result"><b>${esc(r.type)} • ${esc(r.title)}</b><small>${esc(r.sub)}</small></div>`).join('')}`
}
document.getElementById('digiModes').onclick=e=>{const b=e.target.closest('[data-digi-mode]');if(!b)return;digiMode=b.dataset.digiMode;document.querySelectorAll('[data-digi-mode]').forEach(x=>x.classList.toggle('active',x===b));const input=document.getElementById('digiSearch');input.placeholder={question:'Ex. Quels prospects relancer aujourd’hui ?',action:'Ex. Lance un scan des priorités',proposal:'Ex. Prépare une campagne de relance',diagnostic:'Ex. Vérifie l’état du système'}[digiMode];document.getElementById('digiGo').textContent=digiMode==='question'?'Analyser':digiMode==='action'?'Exécuter':digiMode==='proposal'?'Préparer':'Diagnostiquer'};
document.getElementById('digiGo').onclick=searchDigi;document.getElementById('digiSearch').addEventListener('keydown',e=>{if(e.key==='Enter')searchDigi()});

function renderGoalForm(){document.getElementById('monthlyGoal').value=state.settings.monthlyGoal;document.getElementById('monthlyCA').value=state.settings.monthlyCA;document.getElementById('avgBasket').value=state.settings.avgBasket}
document.querySelector('[data-open="goalSheet"]').addEventListener('click',renderGoalForm);document.getElementById('goalForm').onsubmit=e=>{e.preventDefault();state.settings.monthlyGoal=Number(document.getElementById('monthlyGoal').value||0);state.settings.monthlyCA=Number(document.getElementById('monthlyCA').value||0);state.settings.avgBasket=Math.max(1,Number(document.getElementById('avgBasket').value||1));recordCoreEvent('goal_updated',{title:'Objectif mis à jour',detail:`Objectif ${state.settings.monthlyGoal} € • CA ${state.settings.monthlyCA} €`},'AUTO');closeSheets();save();toast('Objectif mis à jour.')};;

function renderAll(){renderHome();renderQuote();renderClients();renderNotes();renderProjects();renderCore();renderPortal();renderKeepConnected();renderModules();renderOperationalFocus()}

// Core configuration
const coreConfigForm=document.getElementById('coreConfigForm');
coreConfigForm.onsubmit=e=>{e.preventDefault();state.core.endpoint=document.getElementById('coreEndpoint').value.trim();state.core.autoSync=document.getElementById('coreAutoSync').checked;state.core.health=state.core.endpoint?'DEGRADED':'LOCAL';recordCoreEvent('core_configured',{title:'Connexion Core mise à jour',detail:state.core.endpoint?'Webhook configuré.':'Mode local uniquement.'},'AUTO');persist();renderAll();closeSheets();toast(state.core.endpoint?'Core configuré. Test de connexion…':'Mode local conservé.');if(state.core.endpoint)syncCore({silent:true})};
document.getElementById('coreSyncBtn').onclick=()=>runAction('core.sync',{source:'core-panel'});
window.addEventListener('online',()=>{if(state.core.autoSync&&state.core.endpoint)syncCore({silent:true})});
setInterval(()=>{localAutopilot();if(state.core.autoSync&&state.core.endpoint)syncCore({silent:true})},60*60*1000);

// Backup / restore
function download(name,text,type='application/json'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
document.getElementById('exportData').onclick=()=>runAction('backup.export',{source:'settings'});document.getElementById('importData').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const data=JSON.parse(await f.text());state=merge(defaultState,data);closeSheets();save();toast('Sauvegarde importée.')}catch{toast('Fichier de sauvegarde invalide.')}e.target.value=''};document.getElementById('resetData').onclick=()=>{if(confirm('Réinitialiser toutes les données locales de cette application ?')){state=clone(defaultState);closeSheets();save();toast('Données réinitialisées.')}};

// PWA
function showUpdateBanner(){const b=document.getElementById('updateBanner');if(b)b.classList.remove('hidden')}
async function forceUpdate(){try{if('serviceWorker' in navigator){const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(r=>r.unregister()));}if(window.caches){const keys=await caches.keys();await Promise.all(keys.filter(k=>k.includes('madyclear')).map(k=>caches.delete(k)));}}catch(e){}const url=new URL(location.href);url.searchParams.set('v',APP_VERSION+'-'+Date.now());location.replace(url.toString())}
document.getElementById('reloadAppBtn')?.addEventListener('click',forceUpdate);document.getElementById('manualUpdate')?.addEventListener('click',forceUpdate);
if('serviceWorker' in navigator)window.addEventListener('load',async()=>{try{const reg=await navigator.serviceWorker.register('./service-worker.js?v='+APP_VERSION);reg.update();setInterval(()=>reg.update(),30*60*1000);reg.addEventListener('updatefound',()=>{const nw=reg.installing;nw&&nw.addEventListener('statechange',()=>{if(nw.state==='installed'&&navigator.serviceWorker.controller)showUpdateBanner()})});navigator.serviceWorker.addEventListener('controllerchange',()=>showUpdateBanner())}catch(e){}});window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;document.getElementById('installBtn').classList.remove('hidden')});document.getElementById('installBtn').onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;document.getElementById('installBtn').classList.add('hidden')};
localAutopilot();
window.__MADYCLEAR_FULL_APP__=true;
document.documentElement.classList.add('mady-full-app');
renderAll();

setTimeout(()=>{try{kcHeartbeat('startup')}catch(e){}},800);

setTimeout(()=>{try{renderPortal()}catch(e){}},500);


const portalPhotoInput=document.getElementById('portalPhotoInput');
if(portalPhotoInput)portalPhotoInput.addEventListener('change',e=>handlePortalPhoto(e.target.files?.[0]));


function updateConnectorStatusFromSettings(){
  state.core.connectorStatus=state.core.connectorStatus||{};
  if(state.core.endpoint){
    state.core.connectorStatus.n8n={...(state.core.connectorStatus.n8n||{}),state:'CONNECTED',label:'n8n'};
  }else if((state.core.connectorStatus.n8n?.state||'TO_CONNECT')!=='PREPARED'){
    state.core.connectorStatus.n8n={...(state.core.connectorStatus.n8n||{}),state:'TO_CONNECT',label:'n8n'};
  }
  persist();
  renderOperationalFocus();
}
setTimeout(()=>{try{migratePreparedConnectors();updateConnectorStatusFromSettings();renderOperationalFocus()}catch(e){}},700);

window.MADYCLEAR_POLICY={
 auto:'LOCAL_ONLY',
 external:'VALIDATION_REQUIRED',
 owner:'Gino',
 describe:()=>({
   auto:'Lecture, calcul, classement et actions locales sûres',
   external:'Validation Gino obligatoire avant exécution'
 })
};

function renderActionPolicy(){
 const el=document.getElementById('actionPolicySummary');
 if(el)el.textContent='AUTO : local sûr uniquement • EXTERNE : validation Gino obligatoire';
}
setTimeout(()=>{try{renderActionPolicy()}catch(e){}},500);

window.addEventListener('error', function(e){
  try{
    var t=document.getElementById('toast');
    if(t){ t.textContent='Mode secours actif'; t.classList.remove('hidden'); }
    console.warn('MADYCLEAR fallback active:', e.message);
  }catch(_){}
});


registerAction('direct.whatsapp',{label:'Ouvrir WhatsApp',scope:'EXTERNAL_READ',permission:'AUTO',handler:()=>openDirectService('whatsapp')});
registerAction('direct.calendar',{label:'Ouvrir Google Calendar',scope:'EXTERNAL_READ',permission:'AUTO',handler:()=>openDirectService('calendar')});
registerAction('direct.drive',{label:'Ouvrir Google Drive',scope:'EXTERNAL_READ',permission:'AUTO',handler:()=>openDirectService('drive')});
registerAction('direct.gmail',{label:'Ouvrir Gmail',scope:'EXTERNAL_READ',permission:'AUTO',handler:()=>openDirectService('gmail')});
registerAction('direct.weather',{label:'Ouvrir Météo Martinique',scope:'EXTERNAL_READ',permission:'AUTO',handler:()=>openDirectService('weather')});
registerAction('direct.supabase',{label:'Ouvrir Supabase',scope:'EXTERNAL_READ',permission:'AUTO',handler:()=>openDirectService('supabase')});
registerAction('direct.n8n',{label:'Ouvrir n8n',scope:'EXTERNAL_READ',permission:'AUTO',handler:()=>openDirectService('n8n')});

