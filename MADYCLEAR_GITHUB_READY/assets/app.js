(() => {
  const WA = '596696017007';
  const catalog = {
    // Textile
    'textile-chaise': {name:'Chaise rembourrée', price:40, category:'Textile', min:80, countMode:'qty'},
    'textile-fauteuil': {name:'Fauteuil 1 place', price:80, category:'Textile', min:80, countMode:'qty'},
    'textile-canape2': {name:'Canapé 2 places', price:160, category:'Textile', min:80, countMode:'qty'},
    'textile-canape3': {name:'Canapé 3 places', price:190, category:'Textile', min:80, countMode:'qty'},
    'textile-angle': {name:'Canapé angle / panoramique', price:240, category:'Textile', min:80, countMode:'qty', requiresValidation:true},
    'textile-matelas1': {name:'Matelas 1 place', price:120, category:'Textile', min:80, countMode:'qty'},
    'textile-matelas2': {name:'Matelas 2 places', price:160, category:'Textile', min:80, countMode:'qty'},
    'textile-tapis': {name:'Tapis standard', price:100, category:'Textile', min:80, countMode:'qty', requiresValidation:true},
    // Textile add-ons
    'supp-tache': {name:'Traitement tache tenace', price:15, category:'Supplément', countAsItem:false},
    'supp-odeur': {name:'Urine / vomi / traitement odeur', price:20, category:'Supplément', countAsItem:false, requiresValidation:true},
    'supp-poils': {name:'Poils / sable important', price:15, category:'Supplément', countAsItem:false},
    'supp-encrassement': {name:'Encrassement exceptionnel', price:20, category:'Supplément', countAsItem:false, startingAt:true, requiresValidation:true},
    'supp-assise': {name:'Assise supplémentaire', price:25, category:'Supplément', countAsItem:false},
    // Automobile
    'auto-exterieur': {name:'Lavage extérieur complet', price:45, category:'Automobile', min:45, countMode:'qty'},
    'auto-interieur': {name:'Nettoyage intérieur', price:45, category:'Automobile', min:45, countMode:'qty'},
    'auto-complet': {name:'Complet intérieur + extérieur', price:85, category:'Automobile', min:45, countMode:'qty', startingAt:true},
    'auto-profond': {name:'Intérieur profond', price:90, category:'Automobile', min:45, countMode:'qty', startingAt:true, requiresValidation:true},
    'auto-remise': {name:'Remise en état importante', price:120, category:'Automobile', min:45, countMode:'qty', startingAt:true, requiresValidation:true},
    'auto-mousse': {name:'Prélavage mousse active', price:15, category:'Option auto', countAsItem:false},
    'auto-carrosserie': {name:'Lavage carrosserie manuel sécurisé', price:25, category:'Option auto', countAsItem:false},
    'auto-jantes': {name:'Nettoyage jantes + pneus', price:15, category:'Option auto', countAsItem:false},
    'auto-dressing': {name:'Finition / dressing pneus', price:10, category:'Option auto', countAsItem:false},
    'auto-hydrophobe': {name:'Protection hydrophobe carrosserie', price:20, category:'Option auto', countAsItem:false},
    'auto-sechage': {name:'Séchage soufflage + microfibre premium', price:10, category:'Option auto', countAsItem:false},
    'auto-vitres-ext': {name:'Vitres extérieures', price:15, category:'Option auto', countAsItem:false},
    'auto-aspiration': {name:'Aspiration habitacle', price:25, category:'Option auto', countAsItem:false},
    'auto-coffre': {name:'Aspiration coffre', price:15, category:'Option auto', countAsItem:false},
    'auto-plastiques': {name:'Tableau de bord + plastiques', price:20, category:'Option auto', countAsItem:false},
    'auto-vitres-int': {name:'Vitres intérieures', price:15, category:'Option auto', countAsItem:false},
    'auto-tapis': {name:'Nettoyage tapis', price:20, category:'Option auto', countAsItem:false},
    'auto-sieges': {name:'Injection/extraction sièges tissu', price:40, category:'Option auto', countAsItem:false, startingAt:true, requiresValidation:true},
    'auto-moquettes': {name:'Injection/extraction moquettes', price:30, category:'Option auto', countAsItem:false, startingAt:true, requiresValidation:true},
    'auto-vapeur': {name:'Vapeur surfaces compatibles', price:20, category:'Option auto', countAsItem:false, requiresValidation:true},
    'auto-desodo': {name:'Désodorisation / finition parfumée', price:10, category:'Option auto', countAsItem:false},
    // Auto supplements
    'auto-suv': {name:'Supplément SUV / 4x4 / grand véhicule', price:10, category:'Supplément auto', countAsItem:false, startingAt:true},
    'auto-utilitaire': {name:'Supplément utilitaire', price:15, category:'Supplément auto', countAsItem:false, startingAt:true},
    'auto-sable': {name:'Sable important', price:15, category:'Supplément auto', countAsItem:false},
    'auto-poils': {name:'Poils d’animaux', price:20, category:'Supplément auto', countAsItem:false},
    'auto-encrassement': {name:'Encrassement important', price:20, category:'Supplément auto', countAsItem:false, startingAt:true, requiresValidation:true},
    'auto-taches': {name:'Traitement spécifique de taches', price:15, category:'Supplément auto', countAsItem:false},
    'auto-coffre-sale': {name:'Coffre très chargé / encrassé', price:15, category:'Supplément auto', countAsItem:false}
  };

  let cart = JSON.parse(localStorage.getItem('madyclearCart') || '{}');
  Object.keys(cart).forEach(id => { if(!catalog[id]) delete cart[id]; });
  localStorage.setItem('madyclearCart', JSON.stringify(cart));
  let packVoisin = localStorage.getItem('madyclearPackVoisin') === '1';
  const query = new URLSearchParams(window.location.search);
  if(query.get('pack') === 'voisin'){ packVoisin = true; localStorage.setItem('madyclearPackVoisin','1'); }

  const formatEuro = n => new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
  const save = () => localStorage.setItem('madyclearCart', JSON.stringify(cart));

  function rawLineTotal(id, qty){
    const item = catalog[id];
    if(!item) return 0;
    let total = item.price * qty;
    if(item.minLine) total = Math.max(total, item.minLine);
    return total;
  }

  function metrics(){
    let subtotal = 0, itemCount = 0, min = 0, needsValidation = false;
    Object.entries(cart).forEach(([id, qty]) => {
      const item = catalog[id]; if(!item || qty <= 0) return;
      subtotal += rawLineTotal(id, qty);
      if(item.min) min = Math.max(min, item.min);
      if(item.countAsItem !== false){ itemCount += item.countMode === 'line' ? 1 : qty; }
      if(item.startingAt || item.requiresValidation) needsValidation = true;
    });
    let rate = 0;
    if(itemCount === 2) rate = .05;
    else if(itemCount >= 3 && itemCount <= 4) rate = .08;
    else if(itemCount >= 5) rate = .10;
    const discounted = subtotal * (1-rate);
    const total = subtotal ? Math.max(min, Math.round(discounted)) : 0;
    const saving = Math.max(0, Math.round(subtotal-total));
    return {subtotal,itemCount,rate,total,saving,min,needsValidation,highGroup:itemCount>=5};
  }

  function add(id, qty=1){
    if(!catalog[id]) return;
    cart[id] = (cart[id] || 0) + qty;
    save(); renderCart(); openCart();
  }
  function setQty(id, qty){
    if(qty <= 0) delete cart[id]; else cart[id]=qty;
    save(); renderCart();
  }
  function clearCart(){ cart={}; save(); renderCart(); }

  const overlay = document.querySelector('.cart-overlay');
  const drawer = document.querySelector('.cart-drawer');
  function openCart(){ if(!drawer) return; drawer.classList.add('open'); overlay?.classList.add('open'); document.body.classList.add('cart-open'); }
  function closeCart(){ drawer?.classList.remove('open'); overlay?.classList.remove('open'); document.body.classList.remove('cart-open'); }

  function renderCart(){
    const itemsEl = document.querySelector('.cart-items');
    const countEls = document.querySelectorAll('.cart-count');
    const summaryEl = document.querySelector('.cart-summary-body');
    const totalQty = Object.values(cart).reduce((a,b)=>a+b,0);
    countEls.forEach(el => el.textContent = totalQty);
    if(!itemsEl || !summaryEl) return;
    const entries = Object.entries(cart).filter(([id,q])=>catalog[id] && q>0);
    if(!entries.length){
      itemsEl.innerHTML='<div class="cart-empty"><strong>Votre sélection est vide.</strong><p>Ajoutez une prestation pour calculer votre estimation.</p></div>';
    } else {
      itemsEl.innerHTML = entries.map(([id,qty]) => {
        const i=catalog[id];
        const unit = i.unit ? ` / ${i.unit}` : '';
        return `<div class="cart-item">
          <div><h4>${i.name}</h4><small>${i.startingAt?'À partir de ':''}${formatEuro(i.price)}${unit}</small>
          <div class="qty"><button data-cart-minus="${id}" aria-label="Diminuer">−</button><strong>${qty}</strong><button data-cart-plus="${id}" aria-label="Augmenter">+</button></div>
          <button class="remove" data-cart-remove="${id}">Retirer</button></div>
          <strong>${formatEuro(rawLineTotal(id,qty))}</strong>
        </div>`;
      }).join('');
    }
    const m=metrics();
    let groupText='';
    if(m.itemCount===1) groupText='1 élément : tarif public.';
    else if(m.itemCount===2) groupText='Offre groupée automatique activée pour 2 éléments.';
    else if(m.itemCount>=3 && m.itemCount<=4) groupText='Offre groupée renforcée activée pour 3 à 4 éléments.';
    else if(m.itemCount>=5) groupText='5 éléments ou + : estimation automatique, meilleur tarif à confirmer par MADYCLEAR.';
    summaryEl.innerHTML = `
      <div class="summary-line"><span>Valeur des prestations</span><strong>${formatEuro(m.subtotal)}</strong></div>
      ${m.saving?`<div class="summary-line saving"><span>Avantage groupé</span><strong>− ${formatEuro(m.saving)}</strong></div>`:''}
      <div class="summary-line total"><span>Votre estimation</span><strong>${formatEuro(m.total)}</strong></div>
      ${groupText?`<div class="group-box">${groupText}${m.rate?` Avantage calculé : ${Math.round(m.rate*100)} %.`:''}${m.highGroup?' Validation manuelle obligatoire avant confirmation.':''}</div>`:''}
      ${m.needsValidation?'<div class="group-box" style="background:#fff7ea;color:#7a4b12">Certaines lignes sont « à partir de » ou nécessitent un diagnostic. Le tarif final est confirmé après photos/état réel.</div>':''}
      <label class="neighbor-toggle"><input type="checkbox" id="pack-voisin-cart" ${packVoisin?'checked':''}> <span><strong>Pack Voisin</strong><br>Un autre client du même secteur souhaite une intervention le même jour.</span></label>
      <div class="cart-actions">
        <a class="btn btn-primary" href="/devis/">Continuer vers le devis</a>
        <button class="btn btn-ghost" type="button" data-clear-cart>Vider la sélection</button>
      </div>`;
    document.getElementById('pack-voisin-cart')?.addEventListener('change', e => {
      packVoisin = e.target.checked; localStorage.setItem('madyclearPackVoisin', packVoisin?'1':'0');
    });
  }

  document.addEventListener('click', e => {
    const addBtn=e.target.closest('[data-add]'); if(addBtn){ add(addBtn.dataset.add, Number(addBtn.dataset.qty||1)); return; }
    const plus=e.target.closest('[data-cart-plus]'); if(plus){ setQty(plus.dataset.cartPlus,(cart[plus.dataset.cartPlus]||0)+1); return; }
    const minus=e.target.closest('[data-cart-minus]'); if(minus){ setQty(minus.dataset.cartMinus,(cart[minus.dataset.cartMinus]||0)-1); return; }
    const rem=e.target.closest('[data-cart-remove]'); if(rem){ setQty(rem.dataset.cartRemove,0); return; }
    if(e.target.closest('[data-open-cart]')){openCart();return;}
    if(e.target.closest('[data-close-cart]') || e.target.classList.contains('cart-overlay')){closeCart();return;}
    if(e.target.closest('[data-clear-cart]')){clearCart();return;}
  });

  // Mobile navigation
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.main-nav');
  toggle?.addEventListener('click',()=>{
    const open=nav.classList.toggle('open'); toggle.setAttribute('aria-expanded',String(open)); document.body.classList.toggle('nav-open',open);
  });
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false');document.body.classList.remove('nav-open')}));

  // Devis page
  const quoteForm=document.getElementById('quote-form');
  const cartPreview=document.getElementById('quote-cart-preview');
  function cartText(){
    const entries=Object.entries(cart).filter(([id,q])=>catalog[id]&&q>0);
    if(!entries.length) return 'Aucune prestation présélectionnée.';
    return entries.map(([id,q])=>`- ${catalog[id].name} × ${q}`).join('\n');
  }
  if(cartPreview){
    const m=metrics();
    cartPreview.innerHTML=`<strong>Votre sélection</strong><pre>${cartText()}</pre><p><strong>Estimation automatique : ${formatEuro(m.total)}</strong>${m.saving?` • économie estimée ${formatEuro(m.saving)}`:''}</p>${packVoisin?'<p>🏘️ Pack Voisin demandé.</p>':''}`;
  }
  quoteForm?.addEventListener('submit', e => {
    e.preventDefault();
    const f=new FormData(quoteForm); const m=metrics();
    const lines=[
      'Bonjour MADYCLEAR, je souhaite préparer une intervention.',
      '', cartText(), '',
      `Estimation du configurateur : ${formatEuro(m.total)}${m.saving?` (avantage groupé estimé : ${formatEuro(m.saving)})`:''}`,
      packVoisin?'Pack Voisin : OUI — un autre client du même secteur est intéressé.':'Pack Voisin : non signalé.',
      '',
      `Nom : ${f.get('nom')||''}`,
      `Téléphone : ${f.get('telephone')||''}`,
      `Commune / secteur : ${f.get('commune')||''}`,
      `Disponibilité souhaitée : ${f.get('disponibilite')||''}`,
      `Détails : ${f.get('details')||''}`,
      '',
      'Je peux joindre mes photos dans cette conversation WhatsApp. Merci de confirmer le tarif et le créneau.'
    ];
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(lines.join('\n'))}`,'_blank','noopener');
  });

  // Contextual WA links
  document.querySelectorAll('[data-wa-message]').forEach(a=>{
    a.href=`https://wa.me/${WA}?text=${encodeURIComponent(a.dataset.waMessage)}`;
  });

  const year=document.querySelectorAll('[data-year]'); year.forEach(el=>el.textContent=new Date().getFullYear());
  renderCart();
})();
