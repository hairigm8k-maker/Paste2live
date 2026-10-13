import { jsonError, ErrorCodes } from "../../_lib/response";
import { getAuthContext } from "../../_lib/session";
import type { Env, WebsiteRow } from "../../_lib/db";

const SECURITY_HEADERS: Record<string, string> = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "cache-control": "no-store",
};

export const onRequestGet: PagesFunction<Env, "id"> = async (ctx) => {
  const { request, env, params } = ctx;
  const auth = await getAuthContext(env, request);
  if (!auth) return jsonError(ErrorCodes.UNAUTHORIZED, "Sign in required", 401);
  const id = params.id as string;

  const site = await env.DB.prepare("SELECT * FROM websites WHERE id = ?").bind(id).first<WebsiteRow>();
  if (!site) return jsonError(ErrorCodes.NOT_FOUND, "Site not found", 404);
  if (site.owner_user_id !== auth.user.id && !auth.user.is_super_admin) {
    return jsonError(ErrorCodes.FORBIDDEN, "Not your site", 403);
  }

  const draft = await env.DB.prepare("SELECT html, css, js FROM site_drafts WHERE website_id = ?")
    .bind(id).first<{ html: string; css: string; js: string }>();

  const html = draft?.html || "<!doctype html><html><body><p>No content yet.</p></body></html>";
  const css = draft?.css || "";
  const js = draft?.js || "";

  let out = html;
  if (css && out.includes("</head>")) {
    out = out.replace("</head>", "<style>" + css + "</style></head>");
  }
  if (js && out.includes("</body>")) {
    out = out.replace("</body>", "<script>" + js + "<\/script></body>");
  }

  return new Response(out, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8", ...SECURITY_HEADERS },
  });
};
