(() => {
  const menuBtn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  const closeMenu = () => {
    if (!menuBtn || !nav) return;
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Ouvrir le menu');
  };

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const nom = String(data.get('nom') || '').trim();
      const telephone = String(data.get('telephone') || '').trim();
      const commune = String(data.get('commune') || '').trim();
      const service = String(data.get('service') || '').trim();
      const details = String(data.get('details') || '').trim();

      const message = [
        'Bonjour MADYCLEAR, je souhaite un devis pour un nettoyage textile.',
        '',
        `Nom : ${nom}`,
        `Téléphone : ${telephone}`,
        commune ? `Commune : ${commune}` : '',
        `Prestation : ${service}`,
        details ? `Détails : ${details}` : '',
        '',
        'Je peux vous envoyer les photos du textile dans cette conversation.'
      ].filter(Boolean).join('\n');

      const url = `https://wa.me/596696017007?text=${encodeURIComponent(message)}`;
      const opened = window.open(url, '_blank', 'noopener,noreferrer');
      if (!opened) window.location.href = url;
    });
  }
})();
