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

  // Source unique des tarifs et règles commerciales : site + cockpit MADYCLEAR.
  const loadOfficialPricing = async () => {
    try {
      const response = await fetch('/assets/madyclear-pricing.json?v=2026-09-20-commercial-v4', {cache: 'no-store'});
      if (!response.ok) throw new Error(`pricing_http_${response.status}`);
      const config = await response.json();
      const textile = config && config.textile;
      if (!textile || !Array.isArray(textile.items)) throw new Error('pricing_invalid');

      window.MADYCLEAR_PRICING = config;
      document.documentElement.dataset.pricingVersion = String(config.version || '');

      const canape2Price = Number(textile.items.find((item) => item.id === 'canape2')?.price || 160);
      document.querySelectorAll('[data-canape2-price]').forEach((node) => {
        node.textContent = `${canape2Price} €`;
      });

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
        const span = sapNote.querySelector('.tax-copy > span') || sapNote.querySelector('span');
        if (span) span.textContent = config.sap.description || '';
      }

      if (config.forfaits) {
        const forfaitPrice = Number(config.forfaits.starting_price_monthly || 130);
        document.querySelectorAll('[data-forfait-price]').forEach((node) => {
          node.textContent = `${forfaitPrice} €`;
        });
        const heroForfait = document.querySelector('.snapshot-item.forfait strong');
        if (heroForfait) heroForfait.textContent = `dès ${forfaitPrice} €/mois`;
        document.querySelectorAll('[data-forfait-frequency]').forEach((node) => {
          node.textContent = config.forfaits.frequency || '2 passages par mois selon la formule';
        });
        const conditions = document.querySelector('[data-forfait-conditions]');
        if (conditions && config.forfaits.conditions) conditions.textContent = config.forfaits.conditions;
      }

      if (config.reservation) {
        const arrhes = Number(config.reservation.amount || 30);
        document.querySelectorAll('[data-reservation-amount]').forEach((node) => {
          node.textContent = `${arrhes} €`;
        });
        const reservationConditions = document.querySelector('[data-reservation-conditions]');
        if (reservationConditions && config.reservation.conditions) {
          reservationConditions.textContent = config.reservation.conditions;
        }

        const payment = config.reservation.payment || {};
        window.MADYCLEAR_BOOKING_PAYMENT = payment;
        const payButton = document.querySelector('[data-reservation-pay]');
        const payStatus = document.querySelector('[data-reservation-payment-status]');
        if (payButton && payment.enabled === true && payment.payment_url) {
          payButton.href = payment.payment_url;
          payButton.hidden = false;
          if (payStatus) payStatus.textContent = `Paiement sécurisé de ${arrhes} € disponible. Cette somme sera déduite de la facture finale.`;
        } else if (payStatus) {
          payStatus.textContent = 'Le paiement sécurisé en ligne est en cours d’activation. Aucun versement ne doit être effectué tant que MADYCLEAR ne vous a pas confirmé le devis et le créneau.';
        }
      }
    } catch (error) {
      // Le HTML contient volontairement les mêmes valeurs en secours : aucune page ne casse si le JSON est indisponible.
      console.warn('MADYCLEAR pricing fallback actif', error);
    }
  };

  loadOfficialPricing();

  document.querySelectorAll('[data-select-service]').forEach((link) => {
    link.addEventListener('click', () => {
      const select = document.querySelector('#quote-form select[name="service"]');
      if (!select) return;
      const requested = String(link.dataset.selectService || '').trim();
      const option = Array.from(select.options).find((item) => item.value === requested || item.textContent.trim() === requested);
      if (option) select.value = option.value || option.textContent.trim();
    });
  });

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
        if (status) status.textContent = '✅ Demande enregistrée. Vous allez maintenant être redirigé vers WhatsApp pour nous envoyer les photos de votre textile.';
      } catch (error) {
        if (status) status.textContent = 'WhatsApp va s’ouvrir. Si nécessaire, envoyez directement votre demande : elle sera traitée manuellement.';
      } finally {
        button.disabled = false;
        button.textContent = 'Envoyer ma demande';
        setTimeout(() => { window.location.href = whatsappUrl; }, 1200);
      }
    });
  }
})();