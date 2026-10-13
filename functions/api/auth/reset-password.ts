import { jsonOk, jsonError, ErrorCodes } from "../_lib/response";
import { validatePassword, readJson } from "../_lib/validate";
import { generateId, randomHex, hashPassword, sha256Hex } from "../_lib/crypto";
import type { Env } from "../_lib/db";

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const body = await readJson<{ token?: string; password?: string }>(request);
  if (!body || !body.token || !body.password) {
    return jsonError(ErrorCodes.VALIDATION, "Token and password required", 400);
  }
  const pw = validatePassword(body.password);
  if (!pw.ok) return jsonError(ErrorCodes.VALIDATION, pw.reason || "Invalid password", 400);

  const tokenHash = await sha256Hex(body.token);
  const now = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare(
    "SELECT id, user_id FROM password_resets WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?"
  ).bind(tokenHash, now).first<{ id: string; user_id: string }>();
  if (!row) return jsonError(ErrorCodes.NOT_FOUND, "Invalid or expired token", 404);

  const saltHex = randomHex(16);
  const passwordHash = await hashPassword(body.password, saltHex);

  await env.DB.batch([
    env.DB.prepare("UPDATE password_resets SET used_at = ? WHERE id = ?").bind(now, row.id),
    env.DB.prepare("UPDATE users SET password_hash = ?, password_salt = ?, updated_at = ? WHERE id = ?")
      .bind(passwordHash, saltHex, now, row.user_id),
    env.DB.prepare("UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL").bind(now, row.user_id),
  ]);

  return jsonOk({ reset: true });
};
