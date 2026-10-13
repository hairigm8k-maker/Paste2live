import { jsonOk } from "../_lib/response";
import type { Env } from "../_lib/db";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const { env } = ctx;
  const [users, sites, active, suspended, releases] = await env.DB.batch([
    env.DB.prepare("SELECT COUNT(*) as c FROM users"),
    env.DB.prepare("SELECT COUNT(*) as c FROM websites"),
    env.DB.prepare("SELECT COUNT(*) as c FROM websites WHERE status = 'active'"),
    env.DB.prepare("SELECT COUNT(*) as c FROM websites WHERE status = 'suspended'"),
    env.DB.prepare("SELECT COUNT(*) as c FROM site_releases"),
  ]);
  return jsonOk({
    users: (users.results?.[0] as { c: number })?.c || 0,
    sites: (sites.results?.[0] as { c: number })?.c || 0,
    active_sites: (active.results?.[0] as { c: number })?.c || 0,
    suspended_sites: (suspended.results?.[0] as { c: number })?.c || 0,
    total_releases: (releases.results?.[0] as { c: number })?.c || 0,
  });
};
