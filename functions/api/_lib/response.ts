export type ApiSuccess<T> = { ok: true; data: T };
export type ApiError = { ok: false; error: { code: string; message: string; details?: unknown } };

export function jsonOk<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify({ ok: true, data }), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export function jsonError(
  code: string,
  message: string,
  status = 400,
  details?: unknown
): Response {
  return new Response(
    JSON.stringify({ ok: false, error: { code, message, details } }),
    {
      status,
      headers: { "content-type": "application/json; charset=utf-8" },
    }
  );
}

export const ErrorCodes = {
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  VALIDATION: "VALIDATION",
  INTERNAL: "INTERNAL",
} as const;
