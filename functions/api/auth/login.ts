import { jsonError, ErrorCodes } from "../_lib/response";
import { validateEmail, readJson } from "../_lib/validate";
import { verifyPassword } from "../_lib/crypto";
import { clientIp, rateLimit, rateLimitResponse } from "../_lib/ratelimit";
import { createSession } from "../_lib/session";
import type { Env, UserRow } from "../_lib/db";

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const ip = clientIp(request);
  const rl = rateLimit("login:" + ip, 5, 900);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  const body = await readJson<{ email?: string; password?: string }>(request);
  if (!body) return jsonError(ErrorCodes.BAD_REQUEST, "Invalid JSON", 400);

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  if (!validateEmail(email) || !password) {
    return jsonError(ErrorCodes.VALIDATION, "Email and password required", 400);
  }

  const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first<UserRow>();
  if (!user || !user.password_hash || !user.password_salt) {
    return jsonError(ErrorCodes.UNAUTHORIZED, "Invalid credentials", 401);
  }

  const ok = await verifyPassword(password, user.password_salt, user.password_hash);
  if (!ok) return jsonError(ErrorCodes.UNAUTHORIZED, "Invalid credentials", 401);

  if (user.status !== "active") {
    return jsonError(ErrorCodes.FORBIDDEN, "Account suspended", 403);
  }

  const session = await createSession(env, user.id, request);
  return new Response(
    JSON.stringify({
      ok: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          email_verified: !!user.email_verified_at,
          role: user.role,
        },
      },
    }),
    {
      status: 200,
      headers: { "content-type": "application/json", "set-cookie": session.cookie },
    }
  );
};
