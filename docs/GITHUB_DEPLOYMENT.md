# GitHub Deployment

## 1. Repository

Repo already exists at github.com/hairigm8k-maker/Paste2live.

## 2. Push initial commit

    cd ~/Paste2live
    git add .
    git commit -m "chore: initial scaffold"
    git push -u origin main

## 3. Connect to Cloudflare Pages

1. Cloudflare dashboard -> Workers and Pages -> Create -> Pages -> Connect to Git
2. Select hairigm8k-maker/Paste2live
3. Production branch: main
4. Build command: npm run build
5. Build output directory: dist
6. Environment variables:
   - NODE_VERSION=20
   - VITE_APP_NAME=Paste2Live
   - VITE_APP_URL=https://app.hairiamri.buzz
   - VITE_SITE_BASE_DOMAIN=sites.hairiamri.buzz
7. Save and deploy

## 4. Set secrets

    wrangler pages secret put SESSION_SECRET --project-name paste2live
    wrangler pages secret put RESEND_API_KEY --project-name paste2live
    wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name paste2live
    wrangler pages secret put SUPER_ADMIN_BOOTSTRAP_EMAIL --project-name paste2live

## 5. Auto-deploy

Every push to main triggers a production deploy. PR branches get preview URLs.

## 6. Worker deployment

The site router Worker is deployed separately:

    cd workers/site-router
    wrangler deploy

Consider adding a GitHub Action to automate Worker deploys. See
.github/workflows/deploy-worker.yml (to be created in Phase 2).
