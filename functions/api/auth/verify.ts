import { jsonOk, jsonError, ErrorCodes } from "../_lib/response";
import { readJson } from "../_lib/validate";
import { sha256Hex } from "../_lib/crypto";
import type { Env } from "../_lib/db";

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const body = await readJson<{ token?: string }>(request);
  if (!body || !body.token) return jsonError(ErrorCodes.VALIDATION, "Token required", 400);

  const tokenHash = await sha256Hex(body.token);
  const now = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare(
    "SELECT id, user_id FROM email_verifications WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?"
  ).bind(tokenHash, now).first<{ id: string; user_id: string }>();

  if (!row) return jsonError(ErrorCodes.NOT_FOUND, "Invalid or expired token", 404);

  await env.DB.batch([
    env.DB.prepare("UPDATE email_verifications SET used_at = ? WHERE id = ?").bind(now, row.id),
    env.DB.prepare("UPDATE users SET email_verified_at = ?, updated_at = ? WHERE id = ?").bind(now, now, row.user_id),
  ]);

  return jsonOk({ verified: true });
};
