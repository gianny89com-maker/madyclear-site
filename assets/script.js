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

  // Source unique des tarifs : le site et le cockpit MADYCLEAR lisent le même fichier.
  const loadOfficialPricing = async () => {
    try {
      const response = await fetch('/assets/madyclear-pricing.json?v=2026-09-17', {cache: 'no-store'});
      if (!response.ok) throw new Error(`pricing_http_${response.status}`);
      const config = await response.json();
      const textile = config && config.textile;
      if (!textile || !Array.isArray(textile.items)) throw new Error('pricing_invalid');

      window.MADYCLEAR_PRICING = config;
      document.documentElement.dataset.pricingVersion = String(config.version || '');

      const grid = document.querySelector('#tarifs .tariff-grid');
      if (grid) {
        const rows = textile.items.concat([{
          id: 'minimum-textile',
          name: "Minimum d’intervention textile",
          price: Number(textile.minimum_intervention || 0),
          condition: true
        }]);
        const fragment = document.createDocumentFragment();
        rows.forEach((item) => {
          const article = document.createElement('article');
          article.className = 'tariff';
          article.dataset.tariffId = item.id || '';
          const title = document.createElement('h3');
          title.textContent = item.name;
          const price = document.createElement('strong');
          price.textContent = `${Number(item.price || 0)} €`;
          article.append(title, price);
          fragment.appendChild(article);
        });
        grid.replaceChildren(fragment);
      }

      const notes = Array.from(document.querySelectorAll('#tarifs .price-notes'));
      const packNote = notes.find((node) => /Composez votre pack/i.test(node.querySelector('strong')?.textContent || ''));
      if (packNote && config.packs) {
        const span = packNote.querySelector('span');
        if (span) span.textContent = `${config.packs.description || ''} ${config.packs.label || ''}`.trim();
      }

      const sapNote = notes.find((node) => /Avantage fiscal/i.test(node.querySelector('strong')?.textContent || ''));
      if (sapNote && config.sap) {
        const span = sapNote.querySelector('span');
        if (span) {
          const exampleBase = Number(textile.items.find((item) => item.id === 'canape2')?.price || 160);
          const rate = Number(config.sap.rate_max || 0);
          const exampleNet = Math.round(exampleBase * (1 - rate));
          span.textContent = `${config.sap.description || ''} Exemple indicatif : une prestation facturée ${exampleBase} € peut représenter un coût de ${exampleNet} € après crédit d’impôt si toutes les conditions sont remplies.`.trim();
        }
      }
    } catch (error) {
      // Le HTML contient volontairement la même grille en secours : aucune page ne casse si le JSON est indisponible.
      console.warn('MADYCLEAR pricing fallback actif', error);
    }
  };

  loadOfficialPricing();

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
