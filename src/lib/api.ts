const API_BASE = "";

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
}

export class ApiError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const opts: RequestInit = {
    method,
    credentials: "include",
    headers: { "content-type": "application/json" },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(API_BASE + path, opts);
  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (!res.ok || !json || !json.ok) {
    const code = json?.error?.code || "HTTP_" + res.status;
    const msg = json?.error?.message || "Request failed";
    throw new ApiError(code, msg, res.status);
  }
  return json.data as T;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  del: <T>(path: string) => request<T>("DELETE", path),
};

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url?: string | null;
  email_verified: boolean;
  role: string;
  is_super_admin?: boolean;
  created_at?: number;
}

export interface Site {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  status: string;
  current_release_id?: string | null;
  owner_email?: string;
  owner_user_id?: string;
  created_at: number;
  updated_at: number;
}

export interface Draft {
  html: string;
  css: string;
  js: string;
  updated_at?: number;
}

export interface Release {
  id: string;
  release_number: number;
  content_hash: string;
  published_by: string;
  status: string;
  created_at: number;
}
