const APP_VERSION='1.9.0-sync';
const CACHE=`madyclear-personal-${APP_VERSION}`;
const ASSETS=['./','./index.html','./app.css','./sync.js','./manifest.webmanifest','./logo.png','./icons/icon-72.png','./icons/icon-96.png','./icons/icon-128.png','./icons/icon-144.png','./icons/icon-152.png','./icons/icon-180.png','./icons/icon-192.png','./icons/icon-384.png','./icons/icon-512.png'];

function patchHtml(source){
  let html=String(source||'');

  // Identité de version — sans changer la clé localStorage ni la structure du cockpit.
  html=html.replaceAll('V1.8.2','V1.9.0');
  html=html.replaceAll('1.8.2-options','1.9.0-sync');
  html=html.replace("const APP_VERSION='1.8.2';","const APP_VERSION='1.9.0';");
  html=html.replace('version:1.82,','version:1.9,');
  html=html.replace('V1.9.0 • Priorité','V1.9.0 • Synchronisation');
  html=html.replace('Textile SAP','Textile domicile');
  html=html.replace('<strong>70 €</strong><small>reste estimé 2P*</small>','<strong>160 €</strong><small>tarif officiel 2P</small>');

  // Grille textile officielle MADYCLEAR publiée sur madyclear.fr.
  html=html.replace("  {id:'pouf',name:'Pouf',price:50,sap:true,detail:'Domicile • textile'},\n",'');
  html=html.replace("  {id:'chaise',name:'Chaise rembourrée',price:40,sap:true,detail:'Par unité'},","  {id:'chaise',name:'Chaise textile',price:40,sap:true,detail:'Tarif officiel • par unité'},");
  html=html.replace("  {id:'fauteuil',name:'Fauteuil 1 place',price:80,sap:true,detail:'Domicile'},","  {id:'fauteuil',name:'Fauteuil',price:80,sap:true,detail:'Tarif officiel'},");
  html=html.replace("  {id:'canape2',name:'Canapé 2 places',price:140,sap:true,detail:'Référence centrale • ≈ 70 € après avantage*'},","  {id:'canape2',name:'Canapé 2 places',price:160,sap:true,detail:'Tarif officiel MADYCLEAR'},");
  html=html.replace("  {id:'canape3',name:'Canapé 3 places',price:160,sap:true,detail:'≈ 80 € après avantage*'},","  {id:'canape3',name:'Canapé 3 places',price:190,sap:true,detail:'Tarif officiel MADYCLEAR'},");
  html=html.replace("  {id:'angle',name:'Canapé angle / 4–5 places',price:220,sap:true,detail:'À partir de'},","  {id:'angle',name:'Canapé angle / panoramique',price:240,sap:true,detail:'Tarif officiel MADYCLEAR'},");
  html=html.replace("  {id:'grand',name:'Grand canapé / U',price:280,sap:true,detail:'À partir de'},\n",'');
  html=html.replace("  {id:'mat1',name:'Matelas 1 place',price:100,sap:true,detail:'Domicile'},","  {id:'mat1',name:'Matelas 1 place',price:120,sap:true,detail:'Tarif officiel MADYCLEAR'},");
  html=html.replace("  {id:'mat2',name:'Matelas 2 places',price:130,sap:true,detail:'Domicile'},","  {id:'mat2',name:'Matelas 2 places',price:160,sap:true,detail:'Tarif officiel MADYCLEAR'},");
  html=html.replace("  {id:'queen',name:'Matelas Queen',price:150,sap:true,detail:'Domicile'},\n",'');
  html=html.replace("  {id:'king',name:'Matelas King',price:170,sap:true,detail:'Domicile'},\n",'');
  html=html.replace("  {id:'tapis',name:'Tapis synthétique — minimum',price:100,sap:true,detail:'30 €/m² • minimum affiché'}","  {id:'tapis',name:'Tapis standard',price:100,sap:true,detail:'Tarif officiel MADYCLEAR'},\n  {id:'minimum-textile',name:'Minimum d’intervention textile',price:80,sap:true,detail:'Minimum par intervention textile'}");

  // État réel des connexions.
  html=html.replace("{id:'supabase',label:'Supabase',detail:'Synchronisation multi-appareils / base centrale',next:'Créer/relier le projet Supabase et ses tables métier.'}","{id:'supabase',label:'Supabase',detail:'CRM public + synchronisation cockpit disponibles',next:'Utiliser le bouton SYNC pour connecter le compte propriétaire puis lancer la synchronisation.'}");
  html=html.replace("{id:'gmail',label:'Gmail',detail:'Lecture, classement, brouillons',next:'Autoriser Gmail puis relier les workflows via n8n.'}","{id:'gmail',label:'Gmail',detail:'Compte disponible • automatisation permanente inactive',next:'Activer les alertes seulement au lancement officiel.'}");
  html=html.replace("{id:'calendar',label:'Google Calendar',detail:'Rendez-vous et planning',next:'Autoriser Calendar puis relier rendez-vous et rappels.'}","{id:'calendar',label:'Google Calendar',detail:'Compte disponible • planning à automatiser',next:'Relier les rendez-vous lorsque le flux officiel de lancement sera activé.'}");
  html=html.replace("{id:'drive',label:'Google Drive',detail:'Photos, devis et documents',next:'Autoriser Drive et choisir les dossiers MADYCLEAR.'}","{id:'drive',label:'Google Drive',detail:'Compte disponible • archivage auto inactif',next:'Choisir les dossiers MADYCLEAR avant toute synchronisation automatique.'}");
  html=html.replace("{id:'whatsapp',label:'WhatsApp Business',detail:'Messages automatisés et notifications',next:'Relier l’API officielle WhatsApp Business après validation.'}","{id:'whatsapp',label:'WhatsApp Business',detail:'Échanges manuels • automatisation préparée',next:'Activer Peach Core uniquement au lancement officiel.'}");

  // Carte d’état consolidée ajoutée autour de l’existant, sans supprimer de module.
  if(!html.includes('id="launch-state-v190"')){
    const marker='<article class="glass operational-focus">';
    const launch=`<article class="glass operational-focus" id="launch-state-v190">
          <div class="section-head compact">
            <div><span class="eyebrow">État du lancement</span><h2>Système MADYCLEAR aujourd’hui</h2></div>
            <span class="ops-state connected">À JOUR</span>
          </div>
          <p class="lead-small">Le site public capte déjà les demandes. Le cockpit peut maintenant les synchroniser avec la base centrale après connexion du compte propriétaire.</p>
          <div class="ops-list">
            <div class="ops-row"><span class="ops-dot ok"></span><div><strong>Site officiel</strong><small>madyclear.fr • production</small></div><span class="ops-state connected">ACTIF</span></div>
            <div class="ops-row"><span class="ops-dot ok"></span><div><strong>Site → CRM</strong><small>Demande enregistrée avant ouverture de WhatsApp</small></div><span class="ops-state connected">ACTIF</span></div>
            <div class="ops-row"><span class="ops-dot ok"></span><div><strong>Cockpit ↔ Supabase</strong><small>Clients, prospects et brouillons de devis • connexion propriétaire requise</small></div><span class="ops-state prepared">SYNC</span></div>
            <div class="ops-row"><span class="ops-dot ok"></span><div><strong>Google</strong><small>Business Profile + Search Console</small></div><span class="ops-state connected">ACTIF</span></div>
            <div class="ops-row"><span class="ops-dot ready"></span><div><strong>WhatsApp client</strong><small>Ouverture après capture CRM • échanges manuels</small></div><span class="ops-state prepared">MANUEL</span></div>
            <div class="ops-row"><span class="ops-dot wait"></span><div><strong>Alertes & relances automatiques</strong><small>Préparées mais volontairement inactives avant lancement</small></div><span class="ops-state waiting">PAUSE</span></div>
          </div>
        </article>

        ${marker}`;
    html=html.replace(marker,launch);
  }

  // Module de synchronisation : ajouté une seule fois au runtime officiel.
  if(!html.includes('src="./sync.js')){
    html=html.replace('</body>',`<script src="./sync.js?v=${APP_VERSION}"></script>\n</body>`);
  }

  return html;
}

function htmlResponse(response,text){
  const headers=new Headers(response.headers);
  headers.set('content-type','text/html; charset=utf-8');
  headers.delete('content-length');
  return new Response(patchHtml(text),{status:response.status,statusText:response.statusText,headers});
}

function isAppClient(url){
  try{return /\/app\/(?:index\.html)?$/.test(new URL(url).pathname)}catch(e){return false}
}

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(ASSETS.map(a=>`${a}?v=${APP_VERSION}`).concat(ASSETS)))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('madyclear-personal-')&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    await Promise.all(windows.filter(c=>isAppClient(c.url)).map(c=>c.navigate(c.url).catch(()=>null)));
  })());
});

self.addEventListener('message',event=>{
  if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin)return;

  const isAppDocument=event.request.mode==='navigate' && /\/app\/(?:index\.html)?$/.test(url.pathname);
  if(isAppDocument){
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .then(async response=>htmlResponse(response,await response.text()))
        .catch(async()=>{
          const cached=await caches.match('./index.html')||await caches.match('./index.html?v='+APP_VERSION);
          if(!cached)return new Response('MADYCLEAR indisponible hors ligne.',{status:503,headers:{'content-type':'text/plain; charset=utf-8'}});
          return htmlResponse(cached,await cached.text());
        })
    );
    return;
  }

  event.respondWith(
    fetch(event.request,{cache:'no-store'})
      .then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        return response;
      })
      .catch(()=>caches.match(event.request))
  );
});