export const SESSION_COOKIE = "__Host-p2l_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function buildSessionCookie(token: string): string {
  return [
    SESSION_COOKIE + "=" + token,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=" + MAX_AGE_SECONDS,
  ].join("; ");
}

export function buildClearSessionCookie(): string {
  return [
    SESSION_COOKIE + "=",
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=0",
  ].join("; ");
}

export function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}
