import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { api, ApiError } from "../../lib/api";
import { formatDate } from "../../lib/format";

interface AdminSite {
  id: string;
  slug: string;
  title: string;
  status: string;
  owner_email: string;
  owner_user_id: string;
  created_at: number;
  updated_at: number;
}

export default function AdminSitesPage() {
  const [sites, setSites] = useState<AdminSite[]>([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (statusFilter) params.set("status", statusFilter);
      const d = await api.get<{ items: AdminSite[]; total: number }>("/api/admin/sites?" + params.toString());
      setSites(d.items);
      setTotal(d.total);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [q, statusFilter]);

  async function handleSuspend(site: AdminSite) {
    const reason = window.prompt("Reason for suspension:");
    if (!reason) return;
    setActioning(site.id);
    setError("");
    try {
      await api.post("/api/admin/sites/" + site.id + "/status", { action: "suspend", reason });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Action failed");
    } finally {
      setActioning(null);
    }
  }

  async function handleUnsuspend(site: AdminSite) {
    setActioning(site.id);
    setError("");
    try {
      await api.post("/api/admin/sites/" + site.id + "/status", { action: "unsuspend" });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Action failed");
    } finally {
      setActioning(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-[#0b3558]">All websites</h1>
        <span className="text-sm text-[#476788]">{total} total</span>
      </div>

      {error && <div className="mt-4 rounded-[8px] border border-[#fecdca] bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]">{error}</div>}

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_200px]">
        <Input placeholder="Search by slug, title, or owner email..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-[8px] border border-[#d4e0ed] bg-white px-3 py-2.5 text-[15px] text-[#0b3558] focus:outline-none focus:ring-2 focus:ring-[#006bff]"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <Card className="mt-4 p-0">
        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : sites.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#476788]">No websites found.</div>
        ) : (
          <ul className="divide-y divide-[#d4e0ed]">
            {sites.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div>
                  <div className="font-medium text-[#0b3558]">{s.title}</div>
                  <div className="text-xs text-[#476788]">{s.slug} &middot; {s.owner_email} &middot; created {formatDate(s.created_at)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={s.status === "active" ? "success" : s.status === "suspended" ? "danger" : "neutral"}>{s.status}</Badge>
                  {s.status === "suspended" ? (
                    <Button variant="outline" size="sm" loading={actioning === s.id} onClick={() => handleUnsuspend(s)}>Unsuspend</Button>
                  ) : (
                    <Button variant="danger" size="sm" loading={actioning === s.id} onClick={() => handleSuspend(s)}>Suspend</Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
