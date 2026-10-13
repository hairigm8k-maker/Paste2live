import { jsonOk, jsonError, ErrorCodes } from "../_lib/response";
import { getAuthContext } from "../_lib/session";
import type { Env } from "../_lib/db";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const auth = await getAuthContext(env, request);
  if (!auth) return jsonError(ErrorCodes.UNAUTHORIZED, "Not signed in", 401);

  return jsonOk({
    user: {
      id: auth.user.id,
      email: auth.user.email,
      name: auth.user.name,
      avatar_url: auth.user.avatar_url,
      email_verified: !!auth.user.email_verified_at,
      role: auth.user.role,
      is_super_admin: !!auth.user.is_super_admin,
      created_at: auth.user.created_at,
    },
  });
};
