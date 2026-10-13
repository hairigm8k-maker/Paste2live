import type { Env, UserRow, SessionRow } from "./db";
import { generateId, randomHex, sha256Hex } from "./crypto";
import { SESSION_COOKIE, buildSessionCookie, buildClearSessionCookie, parseCookies } from "./cookies";

const SESSION_TTL_DAYS = 30;

export interface AuthContext {
  user: UserRow;
  session: SessionRow;
}

export async function createSession(
  env: Env,
  userId: string,
  req: Request
): Promise<{ token: string; cookie: string }> {
  const token = randomHex(32);
  const tokenHash = await sha256Hex(token);
  const id = generateId();
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + SESSION_TTL_DAYS * 86400;

  const userAgent = req.headers.get("user-agent") || null;
  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || null;

  await env.DB.prepare(
    "INSERT INTO sessions (id, user_id, token_hash, user_agent, ip, expires_at) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(id, userId, tokenHash, userAgent, ip, expiresAt)
    .run();

  return { token, cookie: buildSessionCookie(token) };
}

export async function getAuthContext(
  env: Env,
  req: Request
): Promise<AuthContext | null> {
  const cookies = parseCookies(req.headers.get("cookie"));
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;

  const tokenHash = await sha256Hex(token);
  const now = Math.floor(Date.now() / 1000);

  const session = await env.DB.prepare(
    "SELECT * FROM sessions WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > ?"
  )
    .bind(tokenHash, now)
    .first<SessionRow>();

  if (!session) return null;

  const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?")
    .bind(session.user_id)
    .first<UserRow>();

  if (!user || user.status !== "active") return null;

  return { user, session };
}

export async function revokeSession(env: Env, sessionId: string): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare("UPDATE sessions SET revoked_at = ? WHERE id = ?")
    .bind(now, sessionId)
    .run();
}

export function clearSessionCookie(): string {
  return buildClearSessionCookie();
}

export function requireAuth(ctx: AuthContext | null): Response | null {
  if (!ctx) {
    return new Response(
      JSON.stringify({ ok: false, error: { code: "UNAUTHORIZED", message: "Sign in required" } }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }
  return null;
}
