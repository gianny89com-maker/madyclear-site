import {ALLOWED_ORIGINS, SERVICES, prepareRequest, sendRequest} from './pro-form-core.mjs';

const form = document.getElementById('pro-form');
if (form) {
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('form-confirmation');
  const fallback = document.getElementById('form-fallback');
  const service = new URLSearchParams(location.search).get('service');
  if (service && Object.hasOwn(SERVICES, service)) form.elements.namedItem('service').value = service;
  let pending = false;
  let completed = false;
  const announce = (message) => {
    status.hidden = false;
    status.textContent = message;
  };
  const allowed = ALLOWED_ORIGINS.includes(location.origin);
  button.disabled = !allowed;
  if (!allowed) announce('Cette prévisualisation ne transmet pas de demande. Vous pouvez nous contacter par téléphone ou sur WhatsApp.');
  form.addEventListener('input', (event) => event.target.setCustomValidity?.(''));
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!allowed || pending || completed || !form.reportValidity()) return;
    let payload;
    try { payload = prepareRequest(Object.fromEntries(new FormData(form))); }
    catch (error) {
      const field = form.elements.namedItem(error.field);
      const message = error.code === 'contact' ? 'Vérifiez votre numéro de téléphone ou votre adresse e-mail.' : 'Vérifiez les champs obligatoires et la longueur de votre message.';
      if (field) { field.setCustomValidity(message); field.reportValidity(); }
      announce(message);
      return;
    }
    pending = true;
    button.disabled = true;
    button.textContent = 'Envoi en cours…';
    form.setAttribute('aria-busy', 'true');
    fallback.hidden = true;
    announce('Votre demande est en cours d’envoi.');
    try {
      await sendRequest(payload, {origin: location.origin});
      completed = true;
      button.textContent = 'Demande envoyée';
      announce('Merci pour votre demande. Votre demande professionnelle a bien été enregistrée. MADYCLEAR vous recontactera rapidement afin de préciser votre besoin, vérifier la faisabilité de l’intervention et vous proposer la solution la plus adaptée. Aucun rendez-vous n’est confirmé à ce stade.');
    } catch (error) {
      const messages = {
        rate: 'Plusieurs demandes ont été envoyées récemment. Patientez 15 minutes ou contactez-nous directement.',
        contact: 'Vérifiez vos coordonnées avant de renvoyer la demande.',
        unconfirmed: 'L’envoi n’a pas pu être confirmé. Vos informations sont conservées dans ce formulaire. Pour éviter un doublon, vérifiez avec MADYCLEAR par téléphone ou sur WhatsApp.'
      };
      announce(messages[error.code] || messages.unconfirmed);
      fallback.hidden = false;
      button.textContent = 'Envoyer ma demande professionnelle';
    } finally {
      pending = false;
      button.disabled = completed;
      form.removeAttribute('aria-busy');
    }
  });
}
