import { jsonOk } from "../_lib/response";
import type { Env } from "../_lib/db";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get("per_page") || "50", 10)));
  const offset = (page - 1) * perPage;

  const rows = await env.DB.prepare(
    "SELECT a.id, a.action, a.target_type, a.target_id, a.reason, a.created_at, u.email as actor_email FROM admin_audit_logs a LEFT JOIN users u ON u.id = a.actor_user_id ORDER BY a.created_at DESC LIMIT ? OFFSET ?"
  ).bind(perPage, offset).all();
  const total = await env.DB.prepare("SELECT COUNT(*) as c FROM admin_audit_logs").first<{ c: number }>();

  return jsonOk({ items: rows.results || [], total: total?.c || 0, page, per_page: perPage });
};
