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
  const endpoint = 'https://trvmbwpwnpimrxrmvrgd.supabase.co/functions/v1/madyclear-capture';

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const nom = String(data.get('nom') || '').trim();
      const telephone = String(data.get('telephone') || '').trim();
      const email = String(data.get('email') || '').trim();
      const commune = String(data.get('commune') || '').trim();
      const service = String(data.get('service') || '').trim();
      const details = String(data.get('details') || '').trim();
      const website = String(data.get('website') || '').trim();
      const button = form.querySelector('button[type="submit"]');
      const status = document.getElementById('quote-status');

      const message = [
        'Bonjour MADYCLEAR, je souhaite un devis pour un nettoyage textile.',
        '',
        `Nom : ${nom}`,
        `Téléphone : ${telephone}`,
        email ? `E-mail : ${email}` : '',
        commune ? `Commune : ${commune}` : '',
        `Prestation : ${service}`,
        details ? `Détails : ${details}` : '',
        '',
        'Je peux vous envoyer les photos du textile dans cette conversation.'
      ].filter(Boolean).join('\n');
      const whatsappUrl = `https://wa.me/596696017007?text=${encodeURIComponent(message)}`;

      button.disabled = true;
      button.textContent = 'Enregistrement…';
      if (status) status.textContent = 'Votre demande est en cours d’enregistrement sécurisé.';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            workspace_slug: 'madyclear',
            first_name: nom,
            phone: telephone,
            email,
            commune,
            summary: details ? `${service} — ${details}` : service,
            source_channel: 'site_web',
            marketing_consent: false,
            website
          })
        });
        if (!response.ok) throw new Error('capture_failed');
        if (status) status.textContent = 'Demande enregistrée. Ouverture de WhatsApp pour vos photos…';
      } catch (error) {
        if (status) status.textContent = 'WhatsApp va s’ouvrir. Si nécessaire, envoyez directement votre demande : elle sera traitée manuellement.';
      } finally {
        button.disabled = false;
        button.textContent = 'Envoyer ma demande';
        window.location.href = whatsappUrl;
      }
    });
  }
})();
