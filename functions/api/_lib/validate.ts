import { jsonError, ErrorCodes } from "./response";

export function validateEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  if (email.length < 3 || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): { ok: boolean; reason?: string } {
  if (typeof password !== "string") return { ok: false, reason: "Password required" };
  if (password.length < 8) return { ok: false, reason: "Min 8 characters" };
  if (password.length > 200) return { ok: false, reason: "Max 200 characters" };
  return { ok: true };
}

export function validateSlug(slug: string): { ok: boolean; reason?: string } {
  if (typeof slug !== "string") return { ok: false, reason: "Slug required" };
  if (slug.length < 3) return { ok: false, reason: "Min 3 characters" };
  if (slug.length > 40) return { ok: false, reason: "Max 40 characters" };
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(slug)) {
    return { ok: false, reason: "Lowercase letters, numbers, hyphens only" };
  }
  if (slug.startsWith("-") || slug.endsWith("-")) {
    return { ok: false, reason: "Cannot start or end with hyphen" };
  }
  return { ok: true };
}

export async function readJson<T = unknown>(req: Request): Promise<T | null> {
  try {
    const text = await req.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function requireJson(error: string | null): Response | null {
  if (error) return jsonError(ErrorCodes.VALIDATION, error, 400);
  return null;
}
