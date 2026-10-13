import { jsonOk } from "../_lib/response";
import type { Env } from "../_lib/db";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get("per_page") || "20", 10)));
  const offset = (page - 1) * perPage;

  let whereSql = "";
  const params: unknown[] = [];
  if (q) { whereSql = "WHERE lower(email) LIKE ? OR lower(name) LIKE ?"; params.push("%" + q + "%", "%" + q + "%"); }

  const total = await env.DB.prepare("SELECT COUNT(*) as c FROM users " + whereSql).bind(...params).first<{ c: number }>();
  const rows = await env.DB.prepare(
    "SELECT id, email, name, role, status, email_verified_at, created_at FROM users " + whereSql + " ORDER BY created_at DESC LIMIT ? OFFSET ?"
  ).bind(...params, perPage, offset).all();

  return jsonOk({ items: rows.results || [], total: total?.c || 0, page, per_page: perPage });
};
