export const ENDPOINT = 'https://trvmbwpwnpimrxrmvrgd.supabase.co/functions/v1/madyclear-capture';
export const ALLOWED_ORIGINS = ['https://www.madyclear.fr', 'https://madyclear.fr'];
export const SERVICES = {vitres: 'Vitres', clim: 'Clim', auto: 'Auto', plusieurs: 'Plusieurs services', autre: 'Autre besoin professionnel'};
const NEEDS = ['Renfort ponctuel', 'Besoin urgent', 'Entretien récurrent', 'Sous-traitance'];
const LIMITS = {entreprise:120, nom:80, telephone:40, email:160, site:100, creneau:100, message:700};

export class FormError extends Error {
  constructor(code, field = '') { super(code); this.code = code; this.field = field; }
}

export function prepareRequest(values) {
  const v = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, String(value ?? '').trim()]));
  if (v.website) throw new FormError('blocked');
  for (const key of ['entreprise', 'nom', 'telephone', 'site', 'message']) {
    if (!v[key]) throw new FormError('required', key);
  }
  for (const [key, limit] of Object.entries(LIMITS)) {
    if ((v[key] || '').length > limit) throw new FormError('length', key);
  }
  if (!Object.hasOwn(SERVICES, v.service)) throw new FormError('required', 'service');
  if (!NEEDS.includes(v.besoin)) throw new FormError('required', 'besoin');
  const digits = v.telephone.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15) throw new FormError('contact', 'telephone');
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) throw new FormError('contact', 'email');
  if (!v.privacy_ack) throw new FormError('required', 'privacy_ack');
  const summary = [`Demande PRO — ${SERVICES[v.service]}`, `Besoin : ${v.besoin}`, v.creneau ? `Créneau souhaité : ${v.creneau}` : '', v.message].filter(Boolean).join('\n');
  if (summary.length > 1000) throw new FormError('length', 'message');
  return {
    workspace_slug: 'madyclear', company_name: v.entreprise, first_name: v.nom,
    phone: v.telephone, email: v.email || '', commune: v.site, summary,
    source_channel: 'site_web', marketing_consent: false, website: '',
    client_note: ['Origine : formulaire professionnel', `Besoin : ${v.besoin}`, v.creneau ? `Créneau souhaité : ${v.creneau}` : ''].filter(Boolean).join('\n')
  };
}

export async function sendRequest(payload, {origin, fetchImpl = globalThis.fetch, timeoutMs = 15000}) {
  if (!ALLOWED_ORIGINS.includes(origin)) throw new FormError('preview');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(ENDPOINT, {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      credentials: 'omit', signal: controller.signal, body: JSON.stringify(payload)
    });
    if (!response.ok) throw new FormError(response.status === 429 ? 'rate' : response.status === 422 ? 'contact' : 'unconfirmed');
    const result = await response.json();
    if (result?.ok !== true) throw new FormError('unconfirmed');
    return result;
  } catch (error) {
    if (error instanceof FormError) throw error;
    throw new FormError('unconfirmed');
  } finally { clearTimeout(timer); }
}
