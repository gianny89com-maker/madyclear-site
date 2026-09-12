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
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const nom = String(data.get('nom') || '').trim();
      const telephone = String(data.get('telephone') || '').trim();
      const service = String(data.get('service') || '').trim();
      const details = String(data.get('details') || '').trim();
      const message = [
        'Bonjour Madyclear, je souhaite un devis.',
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
