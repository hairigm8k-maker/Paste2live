# Cloudflare AI Setup

## Purpose

Provide an AI support chatbot inside the dashboard, scoped to Paste2Live's
documentation and FAQ. Never expose cross-tenant data.

## Option A - Workers AI binding

Add to wrangler.jsonc:

    "ai": {
      "binding": "AI"
    }

Then in a Pages Function:

    const response = await env.AI.run(
      "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
      {
        messages: [{ role: "user", content: "How do I publish a site?" }]
      }
    );

## Option B - Reuse existing chatbot

The sibling reposaya project has a working chat.js at functions/api/chat.js.
It uses Workers AI with llama-3.3-70b and includes prompt-injection
protections. Adapt it by:

1. Copying the file to functions/api/chat.ts
2. Replacing the system prompt with Paste2Live's FAQ context
3. Keeping the security rules (input length limits, refusal for cross-tenant
   queries, no tool use)

## Guardrails

- Never send user emails, other tenants' data, or session tokens to the model
- Rate limit: 20 requests per hour per user
- Cap input length at 2000 characters
- Cap output tokens at 512
- Log conversations to ai_conversations and ai_messages (retention 30 days)
- Provide escalate-to-support-ticket fallback
