import { jsonOk, jsonError, ErrorCodes } from "../../_lib/response";
import { getAuthContext } from "../../_lib/session";
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
  return jsonOk({ site, draft });
};

export const onRequestPatch: PagesFunction<Env, "id"> = async (ctx) => {
  const { request, env, params } = ctx;
  const auth = await getAuthContext(env, request);
  if (!auth) return jsonError(ErrorCodes.UNAUTHORIZED, "Sign in required", 401);
  const id = params.id as string;
  const site = await env.DB.prepare("SELECT * FROM websites WHERE id = ?").bind(id).first<WebsiteRow>();
  if (!site) return jsonError(ErrorCodes.NOT_FOUND, "Site not found", 404);
  if (site.owner_user_id !== auth.user.id && !auth.user.is_super_admin) return jsonError(ErrorCodes.FORBIDDEN, "Not your site", 403);
  const body = await request.json<{ title?: string; description?: string }>().catch(() => null);
  if (!body) return jsonError(ErrorCodes.BAD_REQUEST, "Invalid JSON", 400);
  const title = body.title !== undefined ? String(body.title).trim().slice(0, 120) : site.title;
  const description = body.description !== undefined ? (String(body.description).trim().slice(0, 300) || null) : site.description;
  if (!title) return jsonError(ErrorCodes.VALIDATION, "Title required", 400);
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare("UPDATE websites SET title = ?, description = ?, updated_at = ? WHERE id = ?").bind(title, description, now, id).run();
  return jsonOk({ updated: true });
};

export const onRequestDelete: PagesFunction<Env, "id"> = async (ctx) => {
  const { request, env, params } = ctx;
  const auth = await getAuthContext(env, request);
  if (!auth) return jsonError(ErrorCodes.UNAUTHORIZED, "Sign in required", 401);
  const id = params.id as string;
  const site = await env.DB.prepare("SELECT * FROM websites WHERE id = ?").bind(id).first<WebsiteRow>();
  if (!site) return jsonError(ErrorCodes.NOT_FOUND, "Site not found", 404);
  if (site.owner_user_id !== auth.user.id && !auth.user.is_super_admin) return jsonError(ErrorCodes.FORBIDDEN, "Not your site", 403);
  await env.DB.prepare("DELETE FROM websites WHERE id = ?").bind(id).run();
  return jsonOk({ deleted: true });
};
