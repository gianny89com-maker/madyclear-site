
const DB_KEY = "madyclear-personal-v1";
const defaultData = {
  clients: [],
  jobs: [],
  quotes: [],
  settings: { ownerName:"Gino", businessPhone:"0696 017007", businessZone:"Martinique" }
};
let data = loadData();
let deferredPrompt = null;

function loadData(){
  try{
    const raw = localStorage.getItem(DB_KEY);
    return raw ? {...defaultData, ...JSON.parse(raw)} : structuredClone(defaultData);
  }catch(e){ return structuredClone(defaultData); }
}
function saveData(){
  localStorage.setItem(DB_KEY, JSON.stringify(data));
  renderAll();
}
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function esc(v=""){ return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m])); }
function euro(n){ return new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR"}).format(Number(n||0)); }

function go(view){
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.dataset.view===view));
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.go===view));
  window.scrollTo({top:0,behavior:"smooth"});
}

document.querySelectorAll("[data-go]").forEach(el=>el.addEventListener("click",()=>go(el.dataset.go)));

function renderAll(){
  document.getElementById("statClients").textContent=data.clients.length;
  document.getElementById("statJobs").textContent=data.jobs.length;
  document.getElementById("statQuotes").textContent=data.quotes.length;
  renderClients();
  renderJobs();
  renderQuotes();
  renderUpcoming();
  document.getElementById("ownerName").value=data.settings.ownerName||"";
  document.getElementById("businessPhone").value=data.settings.businessPhone||"";
  document.getElementById("businessZone").value=data.settings.businessZone||"";
}
function renderClients(filter=""){
  const el=document.getElementById("clientList");
  const q=filter.trim().toLowerCase();
  const rows=data.clients.filter(c=>[c.name,c.phone,c.city].join(" ").toLowerCase().includes(q));
  el.className="list"+(rows.length?"":" empty");
  el.innerHTML=rows.length?rows.map(c=>`
    <div class="item">
      <div><strong>${esc(c.name)}</strong><div class="meta">${esc(c.phone||"")} ${c.city?("• "+esc(c.city)):""}</div></div>
      <button class="text-btn" onclick="deleteClient('${c.id}')">Suppr.</button>
    </div>`).join(""):"Aucun client.";
}
function renderJobs(){
  const el=document.getElementById("jobList");
  const rows=[...data.jobs].sort((a,b)=>(a.date||"").localeCompare(b.date||""));
  el.className="list"+(rows.length?"":" empty");
  el.innerHTML=rows.length?rows.map(j=>`
    <div class="item">
      <div><strong>${esc(j.client)}</strong><div class="meta">${esc(j.date||"")} ${j.time?("à "+esc(j.time)):""}<br>${esc(j.service||"")}</div></div>
      <span class="badge">${esc(j.status||"Prévue")}</span>
    </div>`).join(""):"Aucune intervention.";
}
function renderQuotes(){
  const el=document.getElementById("quoteList");
  const rows=[...data.quotes].reverse();
  el.className="list"+(rows.length?"":" empty");
  el.innerHTML=rows.length?rows.map(q=>`
    <div class="item">
      <div><strong>${esc(q.client)}</strong><div class="meta">${esc(q.service||"")}<br>${esc(q.note||"")}</div></div>
      <strong>${euro(q.amount)}</strong>
    </div>`).join(""):"Aucun devis.";
}
function renderUpcoming(){
  const el=document.getElementById("upcomingJobs");
  const today=new Date().toISOString().slice(0,10);
  const rows=data.jobs.filter(j=>!j.date || j.date>=today).sort((a,b)=>(a.date||"").localeCompare(b.date||"")).slice(0,3);
  el.className="list"+(rows.length?"":" empty");
  el.innerHTML=rows.length?rows.map(j=>`
    <div class="item"><div><strong>${esc(j.client)}</strong><div class="meta">${esc(j.date||"Date à fixer")} ${j.time?("• "+esc(j.time)):""}<br>${esc(j.service||"")}</div></div><span class="badge">${esc(j.status||"Prévue")}</span></div>`).join(""):"Aucune intervention enregistrée.";
}

const modal=document.getElementById("modal");
const modalFields=document.getElementById("modalFields");
const modalTitle=document.getElementById("modalTitle");
let modalType=null;

function openModal(type){
  modalType=type;
  if(type==="client"){
    modalTitle.textContent="Nouveau client";
    modalFields.innerHTML=`
      <label>Nom<input name="name" required></label>
      <label>Téléphone<input name="phone" inputmode="tel"></label>
      <label>Commune<input name="city"></label>`;
  }else if(type==="job"){
    modalTitle.textContent="Nouvelle intervention";
    modalFields.innerHTML=`
      <label>Client<input name="client" required></label>
      <label>Service<input name="service" placeholder="Canapé, matelas, véhicule…"></label>
      <label>Date<input name="date" type="date"></label>
      <label>Heure<input name="time" type="time"></label>
      <label>Statut<select name="status"><option>Prévue</option><option>À confirmer</option><option>Terminée</option></select></label>`;
  }else{
    modalTitle.textContent="Nouveau devis";
    modalFields.innerHTML=`
      <label>Client<input name="client" required></label>
      <label>Prestation<input name="service"></label>
      <label>Montant (€)<input name="amount" type="number" min="0" step="1" value="59"></label>
      <label>Note<textarea name="note" rows="3"></textarea></label>`;
  }
  modal.showModal();
}
document.getElementById("newClientBtn").onclick=()=>openModal("client");
document.getElementById("newJobBtn").onclick=()=>openModal("job");
document.getElementById("newQuoteBtn").onclick=()=>openModal("quote");

document.getElementById("modalForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  const fd=new FormData(e.target);
  const obj=Object.fromEntries(fd.entries());
  obj.id=uid();
  if(modalType==="client") data.clients.push(obj);
  if(modalType==="job") data.jobs.push(obj);
  if(modalType==="quote") data.quotes.push(obj);
  saveData();
  modal.close();
});
window.deleteClient=(id)=>{
  if(confirm("Supprimer ce client ?")){
    data.clients=data.clients.filter(c=>c.id!==id); saveData();
  }
};
document.getElementById("clientSearch").addEventListener("input",e=>renderClients(e.target.value));
document.getElementById("saveSettings").onclick=()=>{
  data.settings={
    ownerName:document.getElementById("ownerName").value.trim(),
    businessPhone:document.getElementById("businessPhone").value.trim(),
    businessZone:document.getElementById("businessZone").value.trim()
  }; saveData(); alert("Réglages enregistrés.");
};

document.getElementById("exportBtn").onclick=()=>{
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a"); a.href=url; a.download="madyclear-personal-backup.json"; a.click();
  URL.revokeObjectURL(url);
};
document.getElementById("importInput").addEventListener("change",async e=>{
  const file=e.target.files?.[0]; if(!file) return;
  try{
    const imported=JSON.parse(await file.text());
    data={...defaultData,...imported}; saveData(); alert("Sauvegarde importée.");
  }catch{ alert("Fichier invalide."); }
});

window.addEventListener("beforeinstallprompt",e=>{
  e.preventDefault(); deferredPrompt=e;
  document.getElementById("installBtn").hidden=false;
});
document.getElementById("installBtn").onclick=async()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt=null;
  document.getElementById("installBtn").hidden=true;
};

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error));
}
renderAll();
