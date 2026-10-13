import { jsonOk, jsonError, ErrorCodes } from "../_lib/response";
import { validateEmail, readJson } from "../_lib/validate";
import { generateId, randomHex, sha256Hex } from "../_lib/crypto";
import { sendEmail, resetPasswordEmailHtml } from "../_lib/email";
import { clientIp, rateLimit, rateLimitResponse } from "../_lib/ratelimit";
import type { Env, UserRow } from "../_lib/db";

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const ip = clientIp(request);
  const rl = rateLimit("forgot:" + ip, 3, 3600);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  const body = await readJson<{ email?: string }>(request);
  if (!body) return jsonError(ErrorCodes.BAD_REQUEST, "Invalid JSON", 400);
  const email = (body.email || "").trim().toLowerCase();
  if (!validateEmail(email)) return jsonError(ErrorCodes.VALIDATION, "Invalid email", 400);

  const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first<UserRow>();
  if (user) {
    const rawToken = randomHex(32);
    const tokenHash = await sha256Hex(rawToken);
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + 3600;
    await env.DB.prepare(
      "INSERT INTO password_resets (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)"
    ).bind(generateId(), user.id, tokenHash, expiresAt).run();
    const resetUrl = (env.APP_ORIGIN || "http://localhost:5173") + "/reset-password?token=" + rawToken;
    await sendEmail(env, {
      to: email,
      subject: "Reset your Paste2Live password",
      html: resetPasswordEmailHtml(user.name || "there", resetUrl),
    });
  }

  return jsonOk({ sent: true });
};
