# DNS and SSL Setup

## Goal

Serve user-published sites at <slug>.sites.hairiamri.buzz without wildcard
custom domain support on Pages (which Cloudflare Pages does not offer).

## Steps

### 1. Wildcard DNS record

In Cloudflare dashboard -> DNS -> Records:

| Type | Name | Content | Proxy status |
|---|---|---|---|
| CNAME | * | sites.hairiamri.buzz | Proxied (orange cloud) |

You also need a record for sites.hairiamri.buzz itself (a dummy A record
pointing to 192.0.2.1 with proxy enabled works fine, because the Worker route
intercepts requests before they reach the origin).

### 2. Worker route

Deploy the site-router Worker:

    cd workers/site-router
    wrangler deploy

Then set the route in dashboard -> Workers -> paste2live-site-router -> Triggers:

- Route: *.sites.hairiamri.buzz/*
- Zone: hairiamri.buzz

### 3. TLS

Cloudflare issues a wildcard certificate for *.sites.hairiamri.buzz
automatically once the DNS record is proxied. No manual action needed.

Verify:

    curl -sSI https://test.sites.hairiamri.buzz | head -5

Expect HTTP/2 404 (Worker responds with 404 because the test slug does not
exist, which is correct).

### 4. Dashboard hostname

Add app.hairiamri.buzz as a custom domain to the Pages project:

Dashboard -> Pages -> paste2live -> Custom domains -> Set up a domain.

## Verification Checklist

- [ ] nslookup app.hairiamri.buzz resolves to Cloudflare IPs
- [ ] nslookup test.sites.hairiamri.buzz resolves to Cloudflare IPs
- [ ] curl https://app.hairiamri.buzz returns the dashboard
- [ ] curl https://nonexistent.sites.hairiamri.buzz returns 404 from Worker
- [ ] TLS certificate covers wildcard (openssl s_client -connect ...)
