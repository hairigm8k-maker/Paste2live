import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { api, type Site } from "../../lib/api";
import { formatRelative } from "../../lib/format";
import { useAuth } from "../../lib/auth";

export default function OverviewPage() {
  const { user } = useAuth();
  const [sites, setSites] = useState<Site[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ items: Site[]; total: number }>("/api/sites?per_page=5")
      .then((d) => { setSites(d.items); setTotal(d.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const active = sites.filter((s) => s.status === "active").length;
  const drafts = sites.filter((s) => s.status === "draft").length;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-bold text-[#0b3558]">Welcome back{user?.name ? ", " + user.name : ""}</h1>
          <p className="mt-1 text-sm text-[#476788]">Here's an overview of your websites.</p>
        </div>
        <Link to="/dashboard/sites/new"><Button variant="primary">New website</Button></Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="text-xs uppercase text-[#476788]">Total sites</div>
          <div className="mt-2 text-[32px] font-bold text-[#0b3558]">{total}</div>
        </Card>
        <Card>
          <div className="text-xs uppercase text-[#476788]">Live</div>
          <div className="mt-2 text-[32px] font-bold text-[#0b3558]">{active}</div>
        </Card>
        <Card>
          <div className="text-xs uppercase text-[#476788]">Drafts</div>
          <div className="mt-2 text-[32px] font-bold text-[#0b3558]">{drafts}</div>
        </Card>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#0b3558]">Recent sites</h2>
          <Link to="/dashboard/sites" className="text-sm font-medium text-[#006bff] hover:underline">View all</Link>
        </div>
        <Card className="mt-4 p-0">
          {loading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : sites.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#476788]">
              <p>No websites yet.</p>
              <div className="mt-4"><Link to="/dashboard/sites/new"><Button variant="primary" size="sm">Create your first site</Button></Link></div>
            </div>
          ) : (
            <ul className="divide-y divide-[#d4e0ed]">
              {sites.map((s) => (
                <li key={s.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <Link to={"/dashboard/sites/" + s.id + "/editor"} className="font-medium text-[#0b3558] hover:text-[#006bff]">{s.title}</Link>
                    <div className="text-xs text-[#476788]">{s.slug} &middot; updated {formatRelative(s.updated_at)}</div>
                  </div>
                  <Badge variant={s.status === "active" ? "success" : s.status === "suspended" ? "danger" : "neutral"}>{s.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
