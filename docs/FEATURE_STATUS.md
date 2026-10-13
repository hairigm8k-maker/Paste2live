# Feature Status

Legend:
- DONE + TESTED - implemented and verified
- DONE UNTESTED - implemented, tests pending
- IN PROGRESS - actively being built
- BLOCKED BY SETUP - waiting on external config
- TODO - not started

## Phase 1 - MVP

### Authentication
| ID | Feature | Status |
|---|---|---|
| U01 | Register with email + password | TODO |
| U02 | Login/logout/session revoke | TODO |
| U03 | Google OAuth | TODO |
| U04 | Email verification (Resend) | BLOCKED BY SETUP |
| U05 | Forgot/reset password | BLOCKED BY SETUP |

### Dashboard and Websites
| ID | Feature | Status |
|---|---|---|
| U06 | Dashboard overview | TODO |
| U07 | Create site + slug validation | TODO |
| U08 | Site list, search, filter, paginate | TODO |
| U09 | Rename/duplicate site | TODO |
| U10 | Archive/delete with confirmation | TODO |

### Editor and Preview
| ID | Feature | Status |
|---|---|---|
| U11 | HTML editor | TODO |
| U12 | CSS editor | TODO |
| U13 | JavaScript editor | TODO |
| U14 | Autocomplete, lint, find | TODO |
| U15 | Isolated live preview | TODO |

### Publishing
| ID | Feature | Status |
|---|---|---|
| U21 | One-click publish | TODO |
| U22 | Auto subdomain reservation | TODO |

### Versions
| ID | Feature | Status |
|---|---|---|
| U26 | Draft autosave | TODO |
| U27 | Version history | TODO |
| U28 | One-click rollback | TODO |
| U29 | Draft/published separation | TODO |

### Security
| ID | Feature | Status |
|---|---|---|
| U41 | Site execution isolation | TODO |
| U43 | Rate limits | TODO |

### Admin
| ID | Feature | Status |
|---|---|---|
| A01-A08 | Admin dashboard, users | TODO |
| A11-A13 | Sites list, detail, suspend | TODO |
| A16-A18 | Reserved slug registry | TODO |
| A21-A25 | Deployments | TODO |
| A31, A35 | Security dashboard, audit | TODO |
| A41, A44-A45 | Platform settings, maintenance, flags | TODO |

## Phase 2 - Utility

| Group | Features | Status |
|---|---|---|
| Assets | U16-U20 uploads, ZIP, file manager | BLOCKED BY SETUP (R2) |
| Domains | U23-U25 custom domain, TLS | BLOCKED BY SETUP (Cloudflare for SaaS) |
| SEO | U30-U35 meta, sitemap, robots | TODO |
| Analytics | U36-U40 | TODO |
| Preferences | U42, U44-U45 | TODO |
| Support | U46-U50 | TODO |
| Admin | A09-A10, A14-A15, A19-A20, A26-A34, A42-A43, A46-A50 | TODO |

## Phase 3 - Commercial

| Group | Features | Status |
|---|---|---|
| Billing | U48-U49, A36-A40 | BLOCKED BY SETUP (payment gateway) |
| Admin MFA | TOTP + recovery | TODO |
| Advanced OAuth | GitHub | TODO |

## Blocked by External Setup

| Feature | Blocker | Notes |
|---|---|---|
| Email sending | Resend domain verification | Set RESEND_API_KEY + verified sender |
| Subdomain live | DNS wildcard + Worker route | Route *.sites.hairiamri.buzz |
| Custom domain | Cloudflare for SaaS | Requires plan + hostname onboarding |
| Payment | Provider not selected | Revenue cards show Not configured |
| R2 uploads | R2 not enabled | Requires enabling in Cloudflare dashboard |
