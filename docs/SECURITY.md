# Security Model

## Principles

1. Default deny. Every mutating endpoint checks session + role + ownership.
2. Never trust client. Role, user_id, owner_id come from the session, not
   the request body.
3. Server-side validation. All input validated with Zod.
4. Parameterized SQL. All D1 queries use .bind(...).
5. Least privilege. Secrets never exposed to the browser bundle.
6. Audit everything. Admin actions logged to admin_audit_logs.

## Isolation

### Origin separation

- Dashboard: app.hairiamri.buzz
- User sites: *.sites.hairiamri.buzz
- Cookies scoped to dashboard only (__Host- prefix, Secure, HttpOnly,
  SameSite=Lax)

### Preview sandbox

User HTML is rendered inside iframe sandbox=allow-scripts WITHOUT
allow-same-origin. This prevents user JavaScript from reading dashboard
cookies or localStorage.

### Content security

User sites are static HTML/CSS/JS only. No server-side execution, no access
to D1/R2 from user content, no ability to call platform APIs.

## Password hashing

- Algorithm: PBKDF2-SHA256
- Iterations: 600000
- Salt: 16 bytes random per user
- Runs in Web Crypto (native to Workers runtime, no native dependency)

## Sessions

- Token: 32 bytes (256 bits) from crypto.getRandomValues
- Stored in DB: SHA-256 hash of token (never the raw token)
- Cookie: __Host-p2l_session, HttpOnly, Secure, SameSite=Lax, Path=/
- TTL: 30 days; revocable; rotated on privilege change

## CSRF

- SameSite=Lax cookie plus Origin/Referer check on all POST/PATCH/DELETE
- No cross-origin form submissions accepted

## Rate limits

- Auth: 5 attempts per 15 min per IP
- Registration: 3 per hour per IP
- Publish: 30 per hour per user
- Chat: 20 per hour per user
- Uploads: 100 per hour per user

## Vulnerability mitigations

- SQL injection: parameterized queries only
- XSS in dashboard: React escapes by default, no dangerouslySetInnerHTML
- XSS in user sites: isolated origin plus sandboxed iframe
- Path traversal: canonicalize and reject .., encoded traversals, null bytes
- ZIP slip: validate every entry path, reject absolute paths and symlinks
- SSRF: user-provided URLs never fetched by the server
- Open redirect: only relative paths allowed in redirect params
- MIME sniffing: X-Content-Type-Options: nosniff on all responses

## Incident response

- Emergency kill switch (A50) freezes publish/upload and shows a notice
- Admin can suspend any site immediately (overrides CDN cache)
- All admin actions audited with actor, timestamp, reason, target
