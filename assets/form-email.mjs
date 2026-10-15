// Destination validée par email. Cet identifiant public n'est pas une clé API.
export const ENDPOINT = 'https://formsubmit.co/ajax/ce821da5d338a55b404a6c0c1a18b0e0';
export const ALLOWED_ORIGINS = ['https://www.madyclear.fr', 'https://madyclear.fr'];

export async function sendFormEmail(payload, {origin = globalThis.location?.origin, fetchImpl = globalThis.fetch, timeoutMs = 25000} = {}) {
  if (!ALLOWED_ORIGINS.includes(origin)) throw new Error('preview');
  if (String(payload.website || '').trim()) throw new Error('blocked');
  const name = [payload.first_name, payload.last_name].filter(Boolean).join(' ').trim();
  if (!(name || payload.company_name) || !(payload.phone || payload.email) || !String(payload.summary || '').trim()) throw new Error('contact');
  const reference = `MC-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const body = {
    _subject: `[MADYCLEAR] Nouvelle demande ${payload.company_name ? 'PRO' : 'PARTICULIER'} — ${reference}`,
    _cc: 'contact@madyclear.fr',
    _template: 'table',
    name: name || payload.company_name,
    'Référence': reference,
    'Entreprise': payload.company_name || '',
    'Téléphone': payload.phone || '',
    'Commune ou site': payload.commune || '',
    'Adresse': payload.address_line || '',
    'Demande': payload.summary,
    'Précisions': payload.client_note || '',
    'Origine': payload.source_channel || 'site_web',
    'Date': new Date().toISOString(),
    _honey: ''
  };
  if (payload.email) body.email = payload.email;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(ENDPOINT, {
      method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      credentials: 'omit', signal: controller.signal, body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(response.status === 429 ? 'rate' : 'unconfirmed');
    const result = await response.json();
    if (result?.success !== true && result?.success !== 'true') throw new Error('unconfirmed');
    return {ok: true, reference};
  } finally { clearTimeout(timer); }
}
