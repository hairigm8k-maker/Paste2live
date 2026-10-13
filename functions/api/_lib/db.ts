export interface Env {
  DB: D1Database;
  AI?: { run: (model: string, input: unknown) => Promise<unknown> };
  ASSETS?: R2Bucket;
  APP_NAME?: string;
  APP_ORIGIN?: string;
  SITE_BASE_DOMAIN?: string;
  SESSION_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  RESEND_FROM_NAME?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  SUPER_ADMIN_BOOTSTRAP_EMAIL?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
}

export interface UserRow {
  id: string;
  email: string;
  email_verified_at: number | null;
  password_hash: string | null;
  password_salt: string | null;
  name: string | null;
  avatar_url: string | null;
  status: string;
  is_super_admin: number;
  role: string;
  created_at: number;
  updated_at: number;
}

export interface SessionRow {
  id: string;
  user_id: string;
  token_hash: string;
  user_agent: string | null;
  ip: string | null;
  expires_at: number;
  revoked_at: number | null;
  created_at: number;
}

export interface WebsiteRow {
  id: string;
  owner_user_id: string;
  slug: string;
  title: string;
  description: string | null;
  status: string;
  current_release_id: string | null;
  created_at: number;
  updated_at: number;
}
