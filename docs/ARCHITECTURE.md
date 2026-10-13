# Architecture

## Overview

Paste2Live is a multi-tenant platform where users paste HTML/CSS/JS and get a
live website at `<slug>.sites.hairiamri.buzz`. Runs entirely on Cloudflare.

## Components

### 1. Dashboard (Cloudflare Pages)
- Host: `app.hairiamri.buzz`
- React SPA (Vite build) served as static assets
- Pages Functions provide `/api/*` endpoints
- Bindings: `DB` (D1), `ASSETS` (R2, Phase 2), `AI` (Workers AI)

### 2. API (Cloudflare Pages Functions)
- `/api/auth/*` register, login, logout, verify, reset, OAuth
- `/api/sites/*` CRUD, draft, preview, publish, releases, files, domains
- `/api/admin/*` user/site/deployment management
- `/api/support/*` tickets
- `/api/chat/*` AI chatbot
- `/api/analytics/*` pageview aggregation

### 3. Site Router Worker
Bound to `*.sites.hairiamri.buzz`. Responsibilities:
- Parse hostname, extract slug
- Look up published ACTIVE site in D1
- Fetch release content from D1/R2
- Serve with correct headers
- Return 404/410/503 for missing/suspended/maintenance

### 4. Database (Cloudflare D1)
SQLite-compatible, serverless. Core tables:
users, sessions, email_verifications, password_resets, websites,
site_drafts, site_files, site_releases, release_files, site_domains,
reserved_slugs, deployment_jobs, usage_daily, site_pageviews_daily,
plans, subscriptions, payment_transactions, support_tickets,
support_messages, notifications, announcements, abuse_reports,
admin_audit_logs, platform_settings, ai_conversations, ai_messages,
email_delivery_logs, webhook_events.

### 5. Email (Resend)
Server-side only. API key stored as Cloudflare secret.

### 6. Chatbot (Workers AI)
AI binding on Pages. Adapted from sibling reposaya project.

## Data Flows

### Auth flow
User register -> POST /api/auth/register -> hash password (PBKDF2-SHA256)
-> insert user + verification token -> Resend email
User verify -> POST /api/auth/verify -> mark verified
User login -> POST /api/auth/login -> create session -> __Host-p2l_session cookie

### Publish flow
Editor autosave -> PATCH /api/sites/:id/draft
Editor publish -> POST /api/sites/:id/publish -> snapshot to site_releases
-> update websites.current_release_id -> insert deployment_jobs

### Site serving flow
Browser -> https://slug.sites.hairiamri.buzz/path
Worker -> parse hostname -> D1 lookup -> check status=active
-> fetch release_file -> return with Content-Type + security headers

### Preview isolation
iframe src=/preview/:token sandbox=allow-scripts (NO allow-same-origin)
Separate origin prevents user JS from accessing dashboard cookies.

## Security Boundaries
- Dashboard and user-site on different origins
- __Host-p2l_session cookie scoped to dashboard only
- Server-side authorization on every mutating endpoint
- Parameterized SQL, Zod validation
- Rate limits on auth/uploads/publish/chat
- Admin MFA (TOTP) before privileged ops
- Audit log for all admin actions
- CSP, X-Content-Type-Options, Referrer-Policy on responses

## Non-Goals
- No arbitrary server-side code execution from user content
- No global wildcard on apex domain
- No filesystem-backed database
