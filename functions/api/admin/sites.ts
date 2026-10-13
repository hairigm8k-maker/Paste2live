import { jsonOk } from "../_lib/response";
import type { Env } from "../_lib/db";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();
  const status = url.searchParams.get("status") || "";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get("per_page") || "20", 10)));
  const offset = (page - 1) * perPage;

  const where: string[] = [];
  const params: unknown[] = [];
  if (q) { where.push("(lower(w.slug) LIKE ? OR lower(w.title) LIKE ? OR lower(u.email) LIKE ?)"); params.push("%" + q + "%", "%" + q + "%", "%" + q + "%"); }
  if (status) { where.push("w.status = ?"); params.push(status); }
  const whereSql = where.length ? "WHERE " + where.join(" AND ") : "";

  const total = await env.DB.prepare(
    "SELECT COUNT(*) as c FROM websites w JOIN users u ON u.id = w.owner_user_id " + whereSql
  ).bind(...params).first<{ c: number }>();
  const rows = await env.DB.prepare(
    "SELECT w.id, w.slug, w.title, w.status, w.created_at, w.updated_at, u.email as owner_email, u.id as owner_user_id FROM websites w JOIN users u ON u.id = w.owner_user_id " + whereSql + " ORDER BY w.updated_at DESC LIMIT ? OFFSET ?"
  ).bind(...params, perPage, offset).all();

  return jsonOk({ items: rows.results || [], total: total?.c || 0, page, per_page: perPage });
};
