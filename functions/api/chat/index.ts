import { jsonOk, jsonError, ErrorCodes } from "../_lib/response";
import { getAuthContext } from "../_lib/session";
import { clientIp, rateLimit, rateLimitResponse } from "../_lib/ratelimit";
import { generateId } from "../_lib/crypto";
import type { Env } from "../_lib/db";

const SYSTEM_PROMPT = "You are the Paste2Live support assistant. Paste2Live lets users paste HTML/CSS/JS and publish them to a live subdomain. Answer concisely, help with: creating a site, choosing a slug, editing HTML/CSS/JS, publishing, versions, rollback, custom domains, billing, and account issues. Never reveal another user's data, code, or session. Never claim to perform actions you cannot perform. If you don't know, tell the user to open a support ticket.";

const MAX_INPUT = 2000;
const MAX_OUTPUT = 512;
const MAX_MESSAGES = 12;

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const auth = await getAuthContext(env, request);
  if (!auth) return jsonError(ErrorCodes.UNAUTHORIZED, "Sign in required", 401);

  const ip = clientIp(request);
  const rl = rateLimit("chat:" + auth.user.id + ":" + ip, 20, 3600);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  const body = await request.json<{ conversation_id?: string; message?: string }>().catch(() => null);
  if (!body || typeof body.message !== "string") {
    return jsonError(ErrorCodes.VALIDATION, "message required", 400);
  }
  const message = body.message.trim().slice(0, MAX_INPUT);
  if (!message) return jsonError(ErrorCodes.VALIDATION, "message empty", 400);

  if (!env.AI) {
    return jsonError(ErrorCodes.INTERNAL, "AI binding not configured", 503);
  }

  let conversationId = body.conversation_id;
  if (!conversationId) {
    conversationId = generateId();
    await env.DB.prepare("INSERT INTO ai_conversations (id, user_id, title) VALUES (?, ?, ?)")
      .bind(conversationId, auth.user.id, message.slice(0, 60)).run();
  } else {
    const owns = await env.DB.prepare("SELECT id FROM ai_conversations WHERE id = ? AND user_id = ?")
      .bind(conversationId, auth.user.id).first();
    if (!owns) return jsonError(ErrorCodes.FORBIDDEN, "Not your conversation", 403);
  }

  const prior = await env.DB.prepare(
    "SELECT role, content FROM ai_messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT ?"
  ).bind(conversationId, MAX_MESSAGES).all<{ role: string; content: string }>();

  const history = (prior.results || []).reverse();
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: message },
  ];

  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare("INSERT INTO ai_messages (id, conversation_id, role, content, created_at) VALUES (?, ?, 'user', ?, ?)")
    .bind(generateId(), conversationId, message, now).run();

  let replyText = "";
  try {
    const result = (await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages,
      max_tokens: MAX_OUTPUT,
    })) as { response?: string };
    replyText = (result.response || "").trim().slice(0, 4000);
  } catch (e) {
    return jsonError(ErrorCodes.INTERNAL, "AI request failed", 500);
  }

  if (!replyText) replyText = "I could not generate a response. Please try again or open a support ticket.";

  await env.DB.prepare("INSERT INTO ai_messages (id, conversation_id, role, content, created_at) VALUES (?, ?, 'assistant', ?, ?)")
    .bind(generateId(), conversationId, replyText, Math.floor(Date.now() / 1000)).run();

  return jsonOk({ conversation_id: conversationId, reply: replyText });
};
