import { jsonOk, jsonError, ErrorCodes } from "../../_lib/response";
import { getAuthContext } from "../../_lib/session";
import { generateId } from "../../_lib/crypto";
import type { Env, WebsiteRow } from "../../_lib/db";

export const onRequestGet: PagesFunction<Env, "id"> = async (ctx) => {
  const { request, env, params } = ctx;
  const auth = await getAuthContext(env, request);
  if (!auth) return jsonError(ErrorCodes.UNAUTHORIZED, "Sign in required", 401);
  const id = params.id as string;
  const site = await env.DB.prepare("SELECT * FROM websites WHERE id = ?").bind(id).first<WebsiteRow>();
  if (!site) return jsonError(ErrorCodes.NOT_FOUND, "Site not found", 404);
  if (site.owner_user_id !== auth.user.id && !auth.user.is_super_admin) return jsonError(ErrorCodes.FORBIDDEN, "Not your site", 403);
  const draft = await env.DB.prepare("SELECT * FROM site_drafts WHERE website_id = ?").bind(id).first();
  return jsonOk({ draft: draft || { html: "", css: "", js: "" } });
};

export const onRequestPatch: PagesFunction<Env, "id"> = async (ctx) => {
  const { request, env, params } = ctx;
  const auth = await getAuthContext(env, request);
  if (!auth) return jsonError(ErrorCodes.UNAUTHORIZED, "Sign in required", 401);
  const id = params.id as string;
  const site = await env.DB.prepare("SELECT * FROM websites WHERE id = ?").bind(id).first<WebsiteRow>();
  if (!site) return jsonError(ErrorCodes.NOT_FOUND, "Site not found", 404);
  if (site.owner_user_id !== auth.user.id && !auth.user.is_super_admin) return jsonError(ErrorCodes.FORBIDDEN, "Not your site", 403);
  const body = await request.json<{ html?: string; css?: string; js?: string }>().catch(() => null);
  if (!body) return jsonError(ErrorCodes.BAD_REQUEST, "Invalid JSON", 400);
  const MAX = 1024 * 1024;
  const html = typeof body.html === "string" ? body.html : "";
  const css = typeof body.css === "string" ? body.css : "";
  const js = typeof body.js === "string" ? body.js : "";
  if (html.length + css.length + js.length > MAX) return jsonError(ErrorCodes.VALIDATION, "Draft too large (max 1 MB)", 400);
  const now = Math.floor(Date.now() / 1000);
  const existing = await env.DB.prepare("SELECT id FROM site_drafts WHERE website_id = ?").bind(id).first<{ id: string }>();
  if (existing) {
    await env.DB.prepare("UPDATE site_drafts SET html = ?, css = ?, js = ?, updated_by = ?, updated_at = ? WHERE website_id = ?").bind(html, css, js, auth.user.id, now, id).run();
  } else {
    await env.DB.prepare("INSERT INTO site_drafts (id, website_id, html, css, js, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(generateId(), id, html, css, js, auth.user.id, now).run();
  }
  await env.DB.prepare("UPDATE websites SET updated_at = ? WHERE id = ?").bind(now, id).run();
  return jsonOk({ saved: true, saved_at: now });
};
