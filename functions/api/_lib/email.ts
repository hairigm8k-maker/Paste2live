import type { Env } from "./db";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(env: Env, opts: SendEmailOptions): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!env.RESEND_API_KEY) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }
  const fromEmail = env.RESEND_FROM_EMAIL || "no-reply@example.com";
  const fromName = env.RESEND_FROM_NAME || "Paste2Live";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "authorization": "Bearer " + env.RESEND_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: fromName + " <" + fromEmail + ">",
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: err };
    }
    const data = (await res.json()) as { id: string };
    return { ok: true, id: data.id };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export function verificationEmailHtml(name: string, verifyUrl: string): string {
  return '<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0b3558">' +
    '<h1 style="font-size:24px;margin:0 0 16px">Verify your email</h1>' +
    '<p>Hi ' + name + ',</p>' +
    '<p>Welcome to Paste2Live. Click the button below to verify your email.</p>' +
    '<p style="margin:24px 0"><a href="' + verifyUrl + '" style="background:#006bff;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">Verify email</a></p>' +
    '<p style="color:#476788;font-size:14px">Or paste this link: ' + verifyUrl + '</p>' +
    '<p style="color:#476788;font-size:14px">This link expires in 24 hours.</p>' +
    '</div>';
}

export function resetPasswordEmailHtml(name: string, resetUrl: string): string {
  return '<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0b3558">' +
    '<h1 style="font-size:24px;margin:0 0 16px">Reset your password</h1>' +
    '<p>Hi ' + name + ',</p>' +
    '<p>Click the button below to reset your password.</p>' +
    '<p style="margin:24px 0"><a href="' + resetUrl + '" style="background:#006bff;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">Reset password</a></p>' +
    '<p style="color:#476788;font-size:14px">If you did not request this, you can ignore it.</p>' +
    '<p style="color:#476788;font-size:14px">This link expires in 1 hour.</p>' +
    '</div>';
}
