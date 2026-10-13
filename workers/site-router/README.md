# Site Router Worker

Serves published user websites at `*.sites.hairiamri.buzz`.

## How it works

1. Parses the incoming hostname against `SITE_BASE_DOMAIN`
2. Extracts the slug (e.g. `myapp` from `myapp.sites.hairiamri.buzz`)
3. Looks up the site in D1 by slug
4. Returns 404 if not found, 410 if suspended, else serves the current release
5. Injects release CSS into `</head>` and release JS before `</body>`

## Deploy

    cd workers/site-router
    npx wrangler deploy

## DNS + Route (manual, one-time)

1. Cloudflare dashboard -> DNS -> Add record:
   - Type: CNAME
   - Name: `*`
   - Content: `sites.hairiamri.buzz`
   - Proxy: Enabled

2. Add dummy A record for `sites` pointing to `192.0.2.1` (proxy enabled)

3. Workers -> paste2live-site-router -> Triggers -> Add route:
   - Route: `*.sites.hairiamri.buzz/*`
   - Zone: `hairiamri.buzz`
