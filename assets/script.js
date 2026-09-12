(() => {
  const menuBtn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const form = document.getElementById('quote-form');
  const serviceField = form?.querySelector('[name="service"]');
  const detailsField = form?.querySelector('[name="details"]');
  const phoneField = form?.querySelector('[name="telephone"]');
  const toast = document.getElementById('selection-toast');
  let toastTimer;

  const choose = (card) => {
    if (!form || !card) return;
    const service = card.dataset.service || '';
    const details = card.dataset.details || '';
    if (serviceField && service) serviceField.value = service;
    if (detailsField && details) detailsField.value = details;
    document.querySelectorAll('.quote-choice.selected').forEach(el => el.classList.remove('selected'));
    card.classList.add('selected');
    if (toast) {
      toast.textContent = `${card.querySelector('h3')?.textContent || 'Prestation'} sélectionné — formulaire prérempli`;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
    }
    document.getElementById('devis')?.scrollIntoView({behavior:'smooth', block:'start'});
    setTimeout(() => phoneField?.focus({preventScroll:true}), 600);
  };

  document.querySelectorAll('.quote-choice').forEach(card => {
    card.addEventListener('click', () => choose(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        choose(card);
      }
    });
  });

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const nom = String(data.get('nom') || '').trim();
      const telephone = String(data.get('telephone') || '').trim();
      const service = String(data.get('service') || '').trim();
      const details = String(data.get('details') || '').trim();
      const message = [
        'Bonjour MADYCLEAR, je souhaite un devis.',
        '',
        `Nom : ${nom}`,
        `Téléphone : ${telephone}`,
        `Besoin : ${service}`,
        details ? `Détails : ${details}` : '',
        '',
        'Je peux vous envoyer les photos du textile.'
      ].filter(Boolean).join('\n');
      window.open(`https://wa.me/596696017007?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    });
  }
})();
