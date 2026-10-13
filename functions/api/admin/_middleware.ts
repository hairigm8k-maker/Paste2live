import { jsonError, ErrorCodes } from "../_lib/response";
import { getAuthContext } from "../_lib/session";
import type { Env } from "../_lib/db";

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const auth = await getAuthContext(ctx.env, ctx.request);
  if (!auth) return jsonError(ErrorCodes.UNAUTHORIZED, "Sign in required", 401);
  const role = auth.user.role;
  const isAdmin = !!auth.user.is_super_admin || role === "super_admin" || role === "admin" || role === "moderator" || role === "support";
  if (!isAdmin) return jsonError(ErrorCodes.FORBIDDEN, "Admin access required", 403);
  ctx.data.user = auth.user;
  return ctx.next();
};
