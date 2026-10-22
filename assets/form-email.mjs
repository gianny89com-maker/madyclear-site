// Every form is saved atomically; email delivery is queued on the server.
export const ENDPOINT = 'https://trvmbwpwnpimrxrmvrgd.supabase.co/functions/v1/madyclear-capture';
export const ALLOWED_ORIGINS = ['https://www.madyclear.fr', 'https://madyclear.fr'];
const attempts = new Map();

async function submissionId(payload) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(payload)));
  const key = 'madyclear-submission-v2:' + Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
  if (attempts.has(key)) return attempts.get(key);
  let id;
  try { id = globalThis.sessionStorage?.getItem(key); } catch {}
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id || '')) id = crypto.randomUUID();
  attempts.set(key, id);
  try { globalThis.sessionStorage?.setItem(key, id); } catch {}
  return id;
}

// Keep the existing export so all three form entry points share this contract.
export async function sendFormEmail(payload, {origin = globalThis.location?.origin, fetchImpl = globalThis.fetch, timeoutMs = 20000} = {}) {
  if (!ALLOWED_ORIGINS.includes(origin)) throw new Error('preview');
  if (String(payload.website || '').trim()) throw new Error('blocked');
  const name = [payload.first_name, payload.last_name].filter(Boolean).join(' ').trim();
  const phone = String(payload.phone || '').replace(/\D/g, '');
  if (!(name || payload.company_name) || !(phone || payload.email) || String(payload.summary || '').trim().length < 3) throw new Error('contact');
  if ((phone && (phone.length < 8 || phone.length > 15)) || (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))) throw new Error('contact');
  const body = {...payload, workspace_slug: 'madyclear', submission_id: await submissionId(payload)};
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(ENDPOINT, {
      method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      credentials: 'omit', signal: controller.signal, body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(response.status === 429 ? 'rate' : response.status === 422 ? 'contact' : 'unconfirmed');
    const result = await response.json();
    if (result?.ok !== true || !/^MC-[0-9A-F-]{36}$/.test(result.reference || '')) throw new Error('unconfirmed');
    return {ok: true, reference: result.reference, notificationStatus: result.notification_status};
  } finally { clearTimeout(timer); }
}
