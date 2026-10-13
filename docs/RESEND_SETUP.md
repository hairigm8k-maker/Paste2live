# Resend Setup

## 1. Verify domain

1. Log in to https://resend.com/domains
2. Add hairiamri.buzz
3. Add the SPF/DKIM/DMARC DNS records Resend provides to Cloudflare DNS
4. Wait for verification (usually a few minutes)

## 2. Create API key

1. Open https://resend.com/api-keys
2. Click Create API Key
3. Permission: Sending access only
4. Copy the key

## 3. Store in Cloudflare

    wrangler pages secret put RESEND_API_KEY

Paste the key when prompted.

## 4. Configure sender

Set in Pages environment variables:

- RESEND_FROM_EMAIL=no-reply@hairiamri.buzz
- RESEND_FROM_NAME=Paste2Live

## 5. Webhook (optional)

For delivery events:

1. Open https://resend.com/webhooks
2. Add endpoint
3. URL: https://app.hairiamri.buzz/api/webhooks/resend
4. Copy signing secret: wrangler pages secret put RESEND_WEBHOOK_SECRET
