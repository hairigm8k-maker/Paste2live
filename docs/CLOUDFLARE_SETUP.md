# Cloudflare Setup

## 1. Enable R2 (optional, Phase 2)

R2 requires accepting terms and adding a payment method in the Cloudflare
dashboard. Free tier includes 10 GB storage + 1M writes + 10M reads per month.

Open: https://dash.cloudflare.com/?to=/:account/r2

After enabling:

    wrangler r2 bucket create paste2live-assets

## 2. Create D1 databases

    wrangler d1 create paste2live-db
    wrangler d1 create paste2live-db-preview

Copy each database_id into wrangler.jsonc.

## 3. Apply migrations

    wrangler d1 migrations apply paste2live-db --local
    wrangler d1 migrations apply paste2live-db --remote

## 4. Set secrets

    wrangler pages secret put SESSION_SECRET
    wrangler pages secret put RESEND_API_KEY
    wrangler pages secret put GOOGLE_CLIENT_SECRET
    wrangler pages secret put SUPER_ADMIN_BOOTSTRAP_EMAIL

## 5. Connect GitHub to Pages

In Cloudflare dashboard: Workers and Pages -> Create -> Pages -> Connect to Git.

- Build command: npm run build
- Build output directory: dist
- Root directory: /
- Environment variables: set those in .env.example (server-side as secrets)

## 6. DNS setup

| Type | Name | Content | Proxy |
|---|---|---|---|
| CNAME | app | <pages-project>.pages.dev | Proxied |
| CNAME | * (under sites) | sites.hairiamri.buzz | Proxied |

## 7. Deploy site router Worker

    cd workers/site-router
    wrangler deploy

Then in Cloudflare dashboard: Workers -> paste2live-site-router -> Settings
-> Triggers -> Add route:

- Route: *.sites.hairiamri.buzz/*
- Zone: hairiamri.buzz

## 8. Google OAuth

1. Go to Google Cloud Console -> APIs and Services -> Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Authorized redirect URI: https://app.hairiamri.buzz/api/auth/google/callback
4. Set GOOGLE_CLIENT_ID as a Pages var (public)
5. Set GOOGLE_CLIENT_SECRET as a Pages secret
