
import { getAuthContext, revokeSession, clearSessionCookie } from "../_lib/session";
import type { Env } from "../_lib/db";

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const auth = await getAuthContext(env, request);
  if (auth) {
    await revokeSession(env, auth.session.id);
  }
  return new Response(JSON.stringify({ ok: true, data: { success: true } }), {
    status: 200,
    headers: { "content-type": "application/json", "set-cookie": clearSessionCookie() },
  });
};
