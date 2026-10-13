import { jsonOk, jsonError, ErrorCodes } from "../_lib/response";
import { validateSlug, readJson } from "../_lib/validate";
import { generateId } from "../_lib/crypto";
import { getAuthContext } from "../_lib/session";
import type { Env, WebsiteRow } from "../_lib/db";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const auth = await getAuthContext(env, request);
  if (!auth) return jsonError(ErrorCodes.UNAUTHORIZED, "Sign in required", 401);

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();
  const status = url.searchParams.get("status") || "";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const perPage = Math.min(50, Math.max(1, parseInt(url.searchParams.get("per_page") || "20", 10)));
  const offset = (page - 1) * perPage;

  const where: string[] = ["owner_user_id = ?"];
  const params: unknown[] = [auth.user.id];
  if (q) { where.push("(lower(slug) LIKE ? OR lower(title) LIKE ?)"); params.push("%" + q + "%", "%" + q + "%"); }
  if (status) { where.push("status = ?"); params.push(status); }

  const whereSql = "WHERE " + where.join(" AND ");
  const countRow = await env.DB.prepare("SELECT COUNT(*) as c FROM websites " + whereSql).bind(...params).first<{ c: number }>();
  const rows = await env.DB.prepare(
    "SELECT id, slug, title, status, current_release_id, created_at, updated_at FROM websites " + whereSql + " ORDER BY updated_at DESC LIMIT ? OFFSET ?"
  ).bind(...params, perPage, offset).all<WebsiteRow>();

  return jsonOk({
    items: rows.results || [],
    page,
    per_page: perPage,
    total: countRow?.c || 0,
  });
};

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const auth = await getAuthContext(env, request);
  if (!auth) return jsonError(ErrorCodes.UNAUTHORIZED, "Sign in required", 401);

  const body = await readJson<{ slug?: string; title?: string; description?: string }>(request);
  if (!body) return jsonError(ErrorCodes.BAD_REQUEST, "Invalid JSON", 400);

  const slug = (body.slug || "").trim().toLowerCase();
  const title = (body.title || "").trim().slice(0, 120);
  const description = (body.description || "").trim().slice(0, 300) || null;

  if (!title) return jsonError(ErrorCodes.VALIDATION, "Title required", 400);
  const slugCheck = validateSlug(slug);
  if (!slugCheck.ok) return jsonError(ErrorCodes.VALIDATION, slugCheck.reason || "Invalid slug", 400);

  const reserved = await env.DB.prepare("SELECT slug FROM reserved_slugs WHERE slug = ?").bind(slug).first();
  if (reserved) return jsonError(ErrorCodes.CONFLICT, "Slug is reserved", 409);

  const existing = await env.DB.prepare("SELECT id FROM websites WHERE slug = ?").bind(slug).first();
  if (existing) return jsonError(ErrorCodes.CONFLICT, "Slug already taken", 409);

  const id = generateId();
  const now = Math.floor(Date.now() / 1000);

  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO websites (id, owner_user_id, slug, title, description, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'draft', ?, ?)"
    ).bind(id, auth.user.id, slug, title, description, now, now),
    env.DB.prepare(
      "INSERT INTO site_drafts (id, website_id, html, css, js, updated_by, updated_at) VALUES (?, ?, '', '', '', ?, ?)"
    ).bind(generateId(), id, auth.user.id, now),
  ]);

  return new Response(
    JSON.stringify({ ok: true, data: { id, slug, title, status: "draft" } }),
    { status: 201, headers: { "content-type": "application/json" } }
  );
};
