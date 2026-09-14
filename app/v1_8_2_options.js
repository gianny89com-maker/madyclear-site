
(function(){
  'use strict';
  const STORE='madyclear-personal-v1';
  const OPT_STORE='madyclear-options-v1';
  const VERSION='1.8.2-options';
  const $=id=>document.getElementById(id);
  const clean=s=>String(s??'').trim();
  const normPhone=v=>String(v||'').replace(/\D/g,'').replace(/^0(?=\d{9}$)/,'596');
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const uid=()=>`${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`;
  function toast(msg){
    if(window.toast){ try{return window.toast(msg)}catch(e){} }
    const t=$('toast'); if(!t)return; t.textContent=msg; t.classList.remove('hidden'); clearTimeout(window.__madyOptToast); window.__madyOptToast=setTimeout(()=>t.classList.add('hidden'),2200);
  }
  function readMain(){try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch(e){return {}}}
  function writeMain(data){localStorage.setItem(STORE,JSON.stringify(data));}
  function readOpt(){try{return JSON.parse(localStorage.getItem(OPT_STORE)||'{}')}catch(e){return {}}}
  function writeOpt(data){localStorage.setItem(OPT_STORE,JSON.stringify(data));}
  function download(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:type||'application/json'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},600)}
  function parseCSV(text){
    const rows=[]; let row=[], cur='', q=false;
    for(let i=0;i<text.length;i++){
      const ch=text[i], nx=text[i+1];
      if(ch==='"'&&q&&nx==='"'){cur+='"';i++;continue}
      if(ch==='"'){q=!q;continue}
      if(ch===','&&!q){row.push(cur);cur='';continue}
      if((ch==='\n'||ch==='\r')&&!q){ if(ch==='\r'&&nx==='\n')i++; row.push(cur); if(row.some(x=>clean(x)))rows.push(row); row=[]; cur=''; continue }
      cur+=ch;
    }
    row.push(cur); if(row.some(x=>clean(x)))rows.push(row);
    if(!rows.length)return [];
    const head=rows.shift().map(h=>clean(h).toLowerCase());
    return rows.map(r=>Object.fromEntries(head.map((h,i)=>[h,clean(r[i]||'')])));
  }
  function mapContact(r){
    const name=r.name||r.nom||r.first_name||r.prenom||r['prénom']||r.company_name||r.societe||r['société']||'Contact importé';
    const segment=r.segment||r.type||r.tags||'Import CSV';
    return {id:uid(),name:clean(name),segment:clean(segment),commune:clean(r.commune||r.ville||''),phone:clean(r.phone||r.telephone||r['téléphone']||r.tel||''),email:clean(r.email||r.mail||''),status:clean(r.status||r.statut||'Prospect')||'Prospect',priority:clean(r.priority||r.priorite||r['priorité']||'Moyenne')||'Moyenne',value:Number(r.value||r.valeur||0)||0,followup:clean(r.followup||r.relance||''),next:clean(r.next||r.prochaine_action||r.action||'Qualifier le contact'),notes:clean(r.notes||'Import CSV MADYCLEAR'),source:'Import CSV',channel:'À valider',automation:'Assistée',updatedAt:new Date().toISOString()};
  }
  async function importClients(file){
    const report=$('bulkClientReport');
    if(!file){return}
    try{
      const rows=parseCSV(await file.text()).map(mapContact).filter(c=>c.name||c.phone||c.email);
      const data=readMain(); data.contacts=Array.isArray(data.contacts)?data.contacts:[];
      const existing=data.contacts;
      const phoneSet=new Map(), emailSet=new Map(), nameSet=new Set();
      existing.forEach(c=>{const p=normPhone(c.phone); if(p)phoneSet.set(p,c); const e=clean(c.email).toLowerCase(); if(e)emailSet.set(e,c); if(c.name)nameSet.add(c.name.toLowerCase())});
      let added=0, merged=0, ignored=0;
      rows.forEach(c=>{
        const p=normPhone(c.phone), e=clean(c.email).toLowerCase();
        let target=(p&&phoneSet.get(p))||(e&&emailSet.get(e));
        if(target){
          target.phone=target.phone||c.phone; target.email=target.email||c.email; target.commune=target.commune||c.commune; target.segment=target.segment||c.segment; target.notes=[target.notes,c.notes].filter(Boolean).join(' | '); target.updatedAt=new Date().toISOString(); merged++; return;
        }
        if(!p&&!e&&nameSet.has(c.name.toLowerCase())){ignored++;return}
        existing.unshift(c); if(p)phoneSet.set(p,c); if(e)emailSet.set(e,c); nameSet.add(c.name.toLowerCase()); added++;
      });
      data.contacts=existing; writeMain(data);
      const opt=readOpt(); opt.lastClientImport={date:new Date().toISOString(),file:file.name,total:rows.length,added,merged,ignored}; writeOpt(opt);
      const msg=`Import prêt ✅\nFichier : ${file.name}\nLignes lues : ${rows.length}\nAjoutés : ${added}\nFusionnés : ${merged}\nIgnorés : ${ignored}\n\nRecharge l’app si la liste Clients ne se met pas à jour immédiatement.`;
      if(report)report.textContent=msg;
      toast(`${added} ajoutés • ${merged} fusionnés`);
      setTimeout(()=>{try{location.reload()}catch(e){}},1400);
    }catch(e){ if(report)report.textContent='Erreur import CSV : '+e.message; toast('Import impossible'); }
  }
  function renderMedia(){
    const opt=readOpt(); const list=(opt.media||[]).slice(0,12);
    const box=$('proMediaList'); if(!box)return;
    box.innerHTML=list.length?list.map(m=>`<div><strong>${esc(m.name)}</strong><br><small>${esc(m.type||'fichier')} • ${Math.round((m.size||0)/1024)} Ko • ${new Date(m.date).toLocaleDateString('fr-FR')}</small></div>`).join('<hr>'):'Aucun média référencé.';
  }
  function addMedia(files){
    const opt=readOpt(); opt.media=Array.isArray(opt.media)?opt.media:[];
    Array.from(files||[]).forEach(f=>opt.media.unshift({id:uid(),name:f.name,type:f.type,size:f.size,date:new Date().toISOString(),status:'brut',usage:'interne_pro',storage:'reference_locale'}));
    opt.media=opt.media.slice(0,300); writeOpt(opt); renderMedia(); toast('Médias référencés en interne');
  }
  function exportAll(){
    const all={exported_at:new Date().toISOString(),version:VERSION,main:readMain(),options:readOpt(),localStorage_keys:Object.keys(localStorage).filter(k=>k.toLowerCase().includes('madyclear'))};
    download(`MADYCLEAR_sauvegarde_complete_${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(all,null,2),'application/json');
    const r=$('backupPlusReport'); if(r)r.textContent='Sauvegarde complète exportée.';
  }
  function exportCRM(){
    const data=readMain(); const rows=Array.isArray(data.contacts)?data.contacts:[];
    const head=['name','segment','commune','phone','email','status','priority','value','followup','next','notes','source'];
    const csv=[head.join(',')].concat(rows.map(c=>head.map(h=>'"'+String(c[h]??'').replace(/"/g,'""')+'"').join(','))).join('\n');
    download(`MADYCLEAR_CRM_export_${new Date().toISOString().slice(0,10)}.csv`,csv,'text/csv;charset=utf-8');
    const r=$('backupPlusReport'); if(r)r.textContent=`CRM exporté : ${rows.length} contacts.`;
  }
  function pwaStatus(){
    const box=$('pwaOptionsStatus'); if(!box)return;
    const standalone=window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    box.textContent=`Version : ${VERSION}\nMode : ${standalone?'application installée':'navigateur / non installée'}\nService worker : ${'serviceWorker' in navigator?'compatible':'indisponible'}\nRéseau : ${navigator.onLine?'en ligne':'hors ligne'}`;
  }
  function forceUpdate(){
    if($('manualUpdate')){$('manualUpdate').click();return}
    location.href=location.pathname+'?v='+VERSION+'-'+Date.now();
  }
  document.addEventListener('DOMContentLoaded',()=>{
    $('bulkClientCsv')?.addEventListener('change',e=>importClients(e.target.files&&e.target.files[0]));
    $('proMediaInput')?.addEventListener('change',e=>addMedia(e.target.files));
    $('fullLocalExport')?.addEventListener('click',exportAll);
    $('crmCsvExport')?.addEventListener('click',exportCRM);
    $('optionsForceUpdate')?.addEventListener('click',forceUpdate);
    pwaStatus(); renderMedia();
  });
  window.MADYCLEAR_OPTIONS={version:VERSION,exportAll,exportCRM,renderMedia};
})();
