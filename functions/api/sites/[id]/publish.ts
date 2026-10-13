import { jsonOk, jsonError, ErrorCodes } from "../../_lib/response";
import { getAuthContext } from "../../_lib/session";
import { generateId, sha256Hex } from "../../_lib/crypto";
import type { Env, WebsiteRow } from "../../_lib/db";

export const onRequestPost: PagesFunction<Env, "id"> = async (ctx) => {
  const { request, env, params } = ctx;
  const auth = await getAuthContext(env, request);
  if (!auth) return jsonError(ErrorCodes.UNAUTHORIZED, "Sign in required", 401);
  const id = params.id as string;

  const site = await env.DB.prepare("SELECT * FROM websites WHERE id = ?").bind(id).first<WebsiteRow>();
  if (!site) return jsonError(ErrorCodes.NOT_FOUND, "Site not found", 404);
  if (site.owner_user_id !== auth.user.id && !auth.user.is_super_admin) return jsonError(ErrorCodes.FORBIDDEN, "Not your site", 403);
  if (site.status === "suspended") return jsonError(ErrorCodes.FORBIDDEN, "Site is suspended", 403);

  const draft = await env.DB.prepare("SELECT * FROM site_drafts WHERE website_id = ?").bind(id).first<{ html: string; css: string; js: string }>();
  if (!draft) return jsonError(ErrorCodes.NOT_FOUND, "No draft to publish", 404);
  if (!draft.html.trim()) return jsonError(ErrorCodes.VALIDATION, "HTML is empty", 400);

  const lastRelease = await env.DB.prepare("SELECT MAX(release_number) as n FROM site_releases WHERE website_id = ?").bind(id).first<{ n: number | null }>();
  const releaseNumber = (lastRelease?.n || 0) + 1;

  const releaseId = generateId();
  const contentHash = await sha256Hex(draft.html + "|" + draft.css + "|" + draft.js);
  const now = Math.floor(Date.now() / 1000);

  const jobId = generateId();

  await env.DB.batch([
    env.DB.prepare("INSERT INTO site_releases (id, website_id, release_number, html, css, js, content_hash, published_by, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'live', ?)")
      .bind(releaseId, id, releaseNumber, draft.html, draft.css, draft.js, contentHash, auth.user.id, now),
    env.DB.prepare("UPDATE websites SET current_release_id = ?, status = 'active', updated_at = ? WHERE id = ?")
      .bind(releaseId, now, id),
    env.DB.prepare("INSERT INTO deployment_jobs (id, website_id, release_id, status, started_at, finished_at, created_at) VALUES (?, ?, ?, 'live', ?, ?, ?)")
      .bind(jobId, id, releaseId, now, now, now),
  ]);

  const publicUrl = "https://" + site.slug + "." + (env.SITE_BASE_DOMAIN || "sites.example.com");

  return jsonOk({
    release_id: releaseId,
    release_number: releaseNumber,
    content_hash: contentHash,
    url: publicUrl,
    published_at: now,
  });
};
