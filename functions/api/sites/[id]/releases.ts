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

  const rows = await env.DB.prepare(
    "SELECT id, release_number, content_hash, published_by, status, created_at FROM site_releases WHERE website_id = ? ORDER BY release_number DESC LIMIT 50"
  ).bind(id).all();

  return jsonOk({ releases: rows.results || [], current_release_id: site.current_release_id });
};
