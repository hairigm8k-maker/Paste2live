import { jsonError, ErrorCodes } from "../_lib/response";
import { validateEmail, validatePassword, readJson } from "../_lib/validate";
import { generateId, randomHex, hashPassword, sha256Hex } from "../_lib/crypto";
import { sendEmail, verificationEmailHtml } from "../_lib/email";
import { clientIp, rateLimit, rateLimitResponse } from "../_lib/ratelimit";
import { createSession } from "../_lib/session";
import type { Env } from "../_lib/db";

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const ip = clientIp(request);
  const rl = rateLimit("register:" + ip, 3, 3600);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  const body = await readJson<{ email?: string; password?: string; name?: string }>(request);
  if (!body) return jsonError(ErrorCodes.BAD_REQUEST, "Invalid JSON", 400);

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  const name = (body.name || "").trim().slice(0, 80);

  if (!validateEmail(email)) return jsonError(ErrorCodes.VALIDATION, "Invalid email", 400);
  const pw = validatePassword(password);
  if (!pw.ok) return jsonError(ErrorCodes.VALIDATION, pw.reason || "Invalid password", 400);

  const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first<{ id: string }>();
  if (existing) return jsonError(ErrorCodes.CONFLICT, "Email already registered", 409);

  const id = generateId();
  const saltHex = randomHex(16);
  const passwordHash = await hashPassword(password, saltHex);
  const now = Math.floor(Date.now() / 1000);

  const isSuperAdmin = env.SUPER_ADMIN_BOOTSTRAP_EMAIL && env.SUPER_ADMIN_BOOTSTRAP_EMAIL.toLowerCase() === email ? 1 : 0;

  await env.DB.prepare(
    "INSERT INTO users (id, email, password_hash, password_salt, name, status, is_super_admin, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)"
  ).bind(id, email, passwordHash, saltHex, name || null, isSuperAdmin, isSuperAdmin ? "super_admin" : "user", now, now).run();

  const rawToken = randomHex(32);
  const tokenHash = await sha256Hex(rawToken);
  const expiresAt = now + 86400;
  await env.DB.prepare(
    "INSERT INTO email_verifications (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)"
  ).bind(generateId(), id, tokenHash, expiresAt).run();

  const verifyUrl = (env.APP_ORIGIN || "http://localhost:5173") + "/verify-email?token=" + rawToken;
  const emailResult = await sendEmail(env, {
    to: email,
    subject: "Verify your Paste2Live email",
    html: verificationEmailHtml(name || "there", verifyUrl),
  });

  const session = await createSession(env, id, request);
  return new Response(
    JSON.stringify({
      ok: true,
      data: {
        user: { id, email, name: name || null, email_verified: false, role: isSuperAdmin ? "super_admin" : "user" },
        email_sent: emailResult.ok,
        email_error: emailResult.ok ? undefined : emailResult.error,
      },
    }),
    {
      status: 201,
      headers: {
        "content-type": "application/json",
        "set-cookie": session.cookie,
      },
    }
  );
};
