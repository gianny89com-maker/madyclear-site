const APP_VERSION='1.9.2-launch';
const CACHE=`madyclear-personal-${APP_VERSION}`;
const PRICING_URL='../assets/madyclear-pricing.json';
const ASSETS=['./','./index.html','./app.css','./sync.js','./manifest.webmanifest','./logo.png','./icons/icon-72.png','./icons/icon-96.png','./icons/icon-128.png','./icons/icon-144.png','./icons/icon-152.png','./icons/icon-180.png','./icons/icon-192.png','./icons/icon-384.png','./icons/icon-512.png',PRICING_URL];

const FALLBACK_PRICING={
  version:'2026-09-17-commercial-v2',
  textile:{
    minimum_intervention:80,
    items:[
      {id:'canape2',name:'Canapé 2 places',price:160,sap_potential:true},
      {id:'canape3',name:'Canapé 3 places',price:190,sap_potential:true},
      {id:'angle',name:'Canapé angle / panoramique',price:240,sap_potential:true},
      {id:'fauteuil',name:'Fauteuil',price:80,sap_potential:true},
      {id:'mat1',name:'Matelas 1 place',price:120,sap_potential:true},
      {id:'mat2',name:'Matelas 2 places',price:160,sap_potential:true},
      {id:'tapis',name:'Tapis standard',price:100,sap_potential:true},
      {id:'chaise',name:'Chaise textile',price:40,sap_potential:true}
    ]
  },
  packs:{mode:'quote_only',display_discount_percentage:false,label:'Pack sur mesure — uniquement sur devis'},
  sap:{rate_max:0.5,automatic:false,commercial_discount:false},
  forfaits:{
    display:true,
    label:'Forfaits entretien',
    starting_price_monthly:130,
    frequency:'2 passages par mois selon la formule',
    internal_calculations_public:false
  },
  reservation:{
    type:'arrhes',
    amount:30,
    deducted_from_final_invoice:true,
    label:'Réservation garantie',
    applies_to:'rendez-vous ponctuels après validation du devis',
    conditions:'Les modalités de report et d’annulation sont précisées avant paiement.',
    automatic_payment:false
  }
};

async function loadPricingConfig(){
  try{
    const response=await fetch(PRICING_URL,{cache:'no-store'});
    if(response.ok){
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(PRICING_URL,copy)).catch(()=>null);
      const json=await response.json();
      if(json?.textile?.items?.length)return json;
    }
  }catch(e){}
  try{
    const cached=await caches.match(PRICING_URL)||await caches.match(`${PRICING_URL}?v=${APP_VERSION}`);
    if(cached){
      const json=await cached.json();
      if(json?.textile?.items?.length)return json;
    }
  }catch(e){}
  return FALLBACK_PRICING;
}

function patchHtml(source,config=FALLBACK_PRICING){
  let html=String(source||'');
  const textile=config?.textile||FALLBACK_PRICING.textile;
  const minimum=Math.max(0,Number(textile.minimum_intervention||80));
  const items=Array.isArray(textile.items)&&textile.items.length?textile.items:FALLBACK_PRICING.textile.items;
  const sapRate=Math.min(1,Math.max(0,Number(config?.sap?.rate_max??0.5)));
  const forfaitPrice=Math.max(0,Number(config?.forfaits?.starting_price_monthly??130));
  const forfaitFrequency=String(config?.forfaits?.frequency||'2 passages par mois selon la formule');
  const reservationAmount=Math.max(0,Number(config?.reservation?.amount??30));

  // Identité de version — sans changer la clé localStorage ni la structure du cockpit.
  html=html.replaceAll('V1.8.2','V1.9.2');
  html=html.replaceAll('1.8.2-options','1.9.2-launch');
  html=html.replace("const APP_VERSION='1.8.2';","const APP_VERSION='1.9.2';");
  html=html.replace('version:1.82,','version:1.92,');
  html=html.replace('V1.9.2 • Priorité','V1.9.2 • Lancement terrain');
  html=html.replace('Textile SAP','Textile lancement');
  html=html.replace('<strong>70 €</strong><small>reste estimé 2P*</small>','<strong>160 €</strong><small>tarif officiel 2P</small>');

  // Le site officiel devient la source de vérité : le cockpit reçoit la même grille.
  const appItems=items.map(item=>{
    const detail=item.id==='chaise'?'Tarif officiel • par unité':'Tarif officiel MADYCLEAR';
    return `  {id:${JSON.stringify(String(item.id||''))},name:${JSON.stringify(String(item.name||''))},price:${Number(item.price||0)},sap:${item.sap_potential!==false},detail:${JSON.stringify(detail)}}`;
  }).join(',\n');
  const pricingBlock=`const TEXTILE_MINIMUM=${minimum};\nconst MADYCLEAR_PRICING_VERSION=${JSON.stringify(String(config?.version||''))};\nconst MADYCLEAR_FORFAIT_MONTHLY=${forfaitPrice};\nconst MADYCLEAR_FORFAIT_FREQUENCY=${JSON.stringify(forfaitFrequency)};\nconst MADYCLEAR_RESERVATION_AMOUNT=${reservationAmount};\nconst pricing={\n textile:[\n${appItems}\n ],\n auto:`;
  html=html.replace(/const pricing=\{\s*textile:\[[\s\S]*?\n \],\n auto:/,pricingBlock);

  // Conditions tarifaires : minimum = plancher de facture, jamais une ligne à ajouter.
  const calcQuote=`function calcQuote(){let subtotal=0,sap=0,labels=[];Object.entries(state.quote.qty).forEach(([id,q])=>{const x=Object.values(pricing).flat().find(y=>y.id===id);if(!x||!q)return;subtotal+=x.price*q;if(x.sap)sap+=x.price*q;labels.push(\`${'${q}'}× ${'${x.name}'}\`)});let total=subtotal;const textileQuote=state.quote.tab==='textile';if(textileQuote&&subtotal>0&&subtotal<TEXTILE_MINIMUM){total=TEXTILE_MINIMUM;labels.push(\`Minimum intervention textile : ${'${TEXTILE_MINIMUM}'} €\`)}if(textileQuote&&total>0)sap=total;const net=(total-sap)+(sap*(1-${sapRate}));document.getElementById('quoteTotal').textContent=money(total).replace(',00','');document.getElementById('quoteSap').textContent=money(sap).replace(',00','');document.getElementById('quoteNet').textContent=money(net).replace(',00','');document.getElementById('quoteNote').textContent=total?\`${'${labels.join(\' • \')}'} . Tarif public avant avantage fiscal. Crédit d’impôt seulement si toutes les conditions sont remplies. Packs : tarif final sur devis, sans remise automatique.\`:'Ajoute une prestation pour commencer.';return{total,sap,net,labels}}`;
  html=html.replace(/function calcQuote\(\)\{[\s\S]*?return\{total,sap,net,labels\}\}/,calcQuote);
  html=html.replace("<p>${esc(x.detail)}${x.sap?' • SAP potentiel':''}</p>","<p>${esc(x.detail)}</p>");
  html=html.replace('<span class="chip waiting">SAP • préparation</span><p>SIRET → déclaration NOVA → activation de l’avantage fiscal.</p>','<span class="chip waiting">SAP • sous conditions</span><p>Le prix public reste le prix facturé. L’estimation fiscale ne s’applique que si les conditions sont remplies.</p>');
  html=html.replace('Part potentiellement SAP','Montant potentiellement éligible');
  html=html.replace('Reste à charge estimé*','Coût indicatif après crédit*');
  html=html.replace('Reste à charge indicatif après crédit d\'impôt potentiel :','Coût indicatif après crédit d\'impôt potentiel, uniquement si éligible :');
  html=html.replace('Reste estimé : ${money(q.net).replace(\',00\',\'\')} • part SAP potentielle :','Coût indicatif si éligible : ${money(q.net).replace(\',00\',\'\')} • montant potentiellement éligible :');

  // Pipeline terrain : on conserve les anciens statuts pour ne perdre aucun contact existant.
  const legacyStatus='<label>Statut<select id="contactStatus"><option>Prospect</option><option>À contacter</option><option>Relance</option><option>Devis envoyé</option><option>RDV</option><option>Client</option><option>Gagné</option><option>Perdu</option></select></label>';
  const launchStatus=`<label>Statut<select id="contactStatus"><option>Prospect</option><option>Nouveau</option><option>À contacter</option><option>Qualifié</option><option>Devis envoyé</option><option>Devis accepté</option><option>Arrhes ${reservationAmount} € reçues</option><option>RDV</option><option>RDV confirmé</option><option>Réalisé</option><option>Payé</option><option>Relance</option><option>À relancer</option><option>Client</option><option>Gagné</option><option>Perdu</option></select></label>`;
  html=html.replace(legacyStatus,launchStatus);

  // État réel des connexions.
  html=html.replace("{id:'supabase',label:'Supabase',detail:'Synchronisation multi-appareils / base centrale',next:'Créer/relier le projet Supabase et ses tables métier.'}","{id:'supabase',label:'Supabase',detail:'CRM public + synchronisation cockpit disponibles',next:'Utiliser le bouton SYNC pour connecter le compte propriétaire puis lancer la synchronisation.'}");
  html=html.replace("{id:'gmail',label:'Gmail',detail:'Lecture, classement, brouillons',next:'Autoriser Gmail puis relier les workflows via n8n.'}","{id:'gmail',label:'Gmail',detail:'Compte disponible • automatisation permanente inactive',next:'Activer les alertes seulement au lancement officiel.'}");
  html=html.replace("{id:'calendar',label:'Google Calendar',detail:'Rendez-vous et planning',next:'Autoriser Calendar puis relier rendez-vous et rappels.'}","{id:'calendar',label:'Google Calendar',detail:'Compte disponible • planning à automatiser',next:'Relier les rendez-vous lorsque le flux officiel de lancement sera activé.'}");
  html=html.replace("{id:'drive',label:'Google Drive',detail:'Photos, devis et documents',next:'Autoriser Drive et choisir les dossiers MADYCLEAR.'}","{id:'drive',label:'Google Drive',detail:'Compte disponible • archivage auto inactif',next:'Choisir les dossiers MADYCLEAR avant toute synchronisation automatique.'}");
  html=html.replace("{id:'whatsapp',label:'WhatsApp Business',detail:'Messages automatisés et notifications',next:'Relier l’API officielle WhatsApp Business après validation.'}","{id:'whatsapp',label:'WhatsApp Business',detail:'Échanges manuels • automatisation préparée',next:'Activer Peach Core uniquement au lancement officiel.'}");

  // Carte mise en activité : objectif 10 prestations + parcours commercial validé.
  if(!html.includes('id="launch-state-v192"')){
    const marker='<article class="glass operational-focus">';
    const launch=`<article class="glass operational-focus" id="launch-state-v192">
          <div class="section-head compact">
            <div><span class="eyebrow">Mise en activité terrain V1</span><h2>Objectif : 10 prestations payées</h2></div>
            <span class="ops-state connected">ACTIF</span>
          </div>
          <p class="lead-small">Lancement centré sur le textile. Chaque prospect doit avancer dans le même tunnel jusqu’au paiement et à la relance.</p>
          <div class="ops-list">
            <div class="ops-row"><span class="ops-dot ok"></span><div><strong>Tarifs site ↔ appli</strong><small>Source officielle unique • version ${String(config?.version||'courante')}</small></div><span class="ops-state connected">ACTIF</span></div>
            <div class="ops-row"><span class="ops-dot ok"></span><div><strong>Pipeline client</strong><small>Nouveau → Qualifié → Devis → Arrhes → RDV → Réalisé → Payé → Relance</small></div><span class="ops-state connected">ACTIF</span></div>
            <div class="ops-row"><span class="ops-dot ready"></span><div><strong>Réservation garantie</strong><small>${reservationAmount} € d’arrhes après validation du devis • déduites du solde</small></div><span class="ops-state prepared">MANUEL</span></div>
            <div class="ops-row"><span class="ops-dot ready"></span><div><strong>Forfait entretien</strong><small>À partir de ${forfaitPrice} €/mois • ${forfaitFrequency}</small></div><span class="ops-state prepared">ACTIF</span></div>
            <div class="ops-row"><span class="ops-dot ok"></span><div><strong>Site → CRM</strong><small>Demande enregistrée avant ouverture de WhatsApp</small></div><span class="ops-state connected">ACTIF</span></div>
            <div class="ops-row"><span class="ops-dot ok"></span><div><strong>Cockpit ↔ Supabase</strong><small>Clients, prospects et brouillons de devis • connexion propriétaire requise</small></div><span class="ops-state prepared">SYNC</span></div>
            <div class="ops-row"><span class="ops-dot wait"></span><div><strong>Paiement automatique</strong><small>Stripe mis de côté • aucun encaissement automatique actif</small></div><span class="ops-state waiting">PAUSE</span></div>
          </div>
        </article>

        ${marker}`;
    html=html.replace(marker,launch);
  }

  // Bloc commercial dans l’écran devis, sans supprimer les modules historiques.
  if(!html.includes('id="launch-offer-v192"')){
    const quoteHeader='<div class="page-title"><span class="eyebrow">MADYCLEAR</span><h1>Devis terrain</h1><p>Tu sélectionnes. L’appli calcule. Tu gardes la décision finale.</p></div>';
    const launchOffer=`${quoteHeader}
        <article class="glass quote-status" id="launch-offer-v192">
          <div><span class="chip waiting">Lancement textile</span><p><strong>Forfait entretien :</strong> à partir de ${forfaitPrice} €/mois • ${forfaitFrequency}.</p><p><strong>Réservation :</strong> ${reservationAmount} € d’arrhes après acceptation du devis, encaissées manuellement pour le moment et déduites du solde.</p></div>
        </article>`;
    html=html.replace(quoteHeader,launchOffer);
  }

  // Module de synchronisation : ajouté une seule fois au runtime officiel.
  if(!html.includes('src="./sync.js')){
    html=html.replace('</body>',`<script src="./sync.js?v=${APP_VERSION}"></script>\n</body>`);
  }

  return html;
}

function htmlResponse(response,text,config){
  const headers=new Headers(response.headers);
  headers.set('content-type','text/html; charset=utf-8');
  headers.delete('content-length');
  return new Response(patchHtml(text,config),{status:response.status,statusText:response.statusText,headers});
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
    event.respondWith((async()=>{
      const config=await loadPricingConfig();
      try{
        const response=await fetch(event.request,{cache:'no-store'});
        return htmlResponse(response,await response.text(),config);
      }catch(e){
        const cached=await caches.match('./index.html')||await caches.match('./index.html?v='+APP_VERSION);
        if(!cached)return new Response('MADYCLEAR indisponible hors ligne.',{status:503,headers:{'content-type':'text/plain; charset=utf-8'}});
        return htmlResponse(cached,await cached.text(),config);
      }
    })());
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
