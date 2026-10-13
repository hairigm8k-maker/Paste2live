interface Env {
  DB: D1Database;
  SITE_BASE_DOMAIN: string;
}

interface SiteRow {
  id: string;
  slug: string;
  status: string;
  current_release_id: string | null;
}

interface ReleaseRow {
  id: string;
  html: string;
  css: string;
  js: string;
}

const SECURITY_HEADERS: Record<string, string> = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "SAMEORIGIN",
};

function html404(): Response {
  return new Response(
    "<!doctype html><html><head><meta charset=\"utf-8\"><title>404 - Not Found</title><style>body{font-family:system-ui,sans-serif;background:#f8f9fb;color:#0b3558;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}div{text-align:center}h1{font-size:64px;margin:0}p{color:#476788}</style></head><body><div><h1>404</h1><p>This site does not exist on Paste2Live.</p></div></body></html>",
    { status: 404, headers: { "content-type": "text/html; charset=utf-8", ...SECURITY_HEADERS } }
  );
}

function html410(): Response {
  return new Response(
    "<!doctype html><html><head><meta charset=\"utf-8\"><title>Site Unavailable</title><style>body{font-family:system-ui,sans-serif;background:#f8f9fb;color:#0b3558;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}div{text-align:center}h1{font-size:48px;margin:0}p{color:#476788}</style></head><body><div><h1>Site unavailable</h1><p>This site has been suspended by an administrator.</p></div></body></html>",
    { status: 410, headers: { "content-type": "text/html; charset=utf-8", ...SECURITY_HEADERS } }
  );
}

function extractSlug(hostname: string, base: string): string | null {
  const host = hostname.toLowerCase().split(":")[0];
  const suffix = "." + base.toLowerCase();
  if (!host.endsWith(suffix)) return null;
  const slug = host.slice(0, -suffix.length);
  if (!slug || slug.includes(".")) return null;
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(slug)) return null;
  return slug;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const slug = extractSlug(url.hostname, env.SITE_BASE_DOMAIN);
    if (!slug) return html404();

    const site = await env.DB.prepare(
      "SELECT id, slug, status, current_release_id FROM websites WHERE slug = ?"
    ).bind(slug).first<SiteRow>();

    if (!site) return html404();
    if (site.status !== "active") return html410();
    if (!site.current_release_id) return html404();

    const release = await env.DB.prepare(
      "SELECT id, html, css, js FROM site_releases WHERE id = ? AND website_id = ?"
    ).bind(site.current_release_id, site.id).first<ReleaseRow>();

    if (!release) return html404();

    const path = url.pathname;
    if (path === "/" || path === "/index.html" || !path.includes(".")) {
      let html = release.html;
      if (release.css && html.includes("</head>")) {
        html = html.replace("</head>", "<style>" + release.css + "</style></head>");
      }
      if (release.js && html.includes("</body>")) {
        html = html.replace("</body>", "<script>" + release.js + "<\/script></body>");
      }
      return new Response(html, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=60, must-revalidate",
          ...SECURITY_HEADERS,
        },
      });
    }

    return html404();
  },
};
