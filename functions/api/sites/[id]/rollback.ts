import { jsonOk, jsonError, ErrorCodes } from "../../_lib/response";
import { getAuthContext } from "../../_lib/session";
import type { Env, WebsiteRow } from "../../_lib/db";

export const onRequestPost: PagesFunction<Env, "id"> = async (ctx) => {
  const { request, env, params } = ctx;
  const auth = await getAuthContext(env, request);
  if (!auth) return jsonError(ErrorCodes.UNAUTHORIZED, "Sign in required", 401);
  const id = params.id as string;

  const body = await request.json<{ release_id?: string }>().catch(() => null);
  if (!body || !body.release_id) return jsonError(ErrorCodes.VALIDATION, "release_id required", 400);

  const site = await env.DB.prepare("SELECT * FROM websites WHERE id = ?").bind(id).first<WebsiteRow>();
  if (!site) return jsonError(ErrorCodes.NOT_FOUND, "Site not found", 404);
  if (site.owner_user_id !== auth.user.id && !auth.user.is_super_admin) return jsonError(ErrorCodes.FORBIDDEN, "Not your site", 403);

  const release = await env.DB.prepare("SELECT id FROM site_releases WHERE id = ? AND website_id = ?").bind(body.release_id, id).first();
  if (!release) return jsonError(ErrorCodes.NOT_FOUND, "Release not found", 404);

  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare("UPDATE websites SET current_release_id = ?, updated_at = ? WHERE id = ?").bind(body.release_id, now, id).run();

  return jsonOk({ rolled_back: true, release_id: body.release_id });
};
