import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";
import { api, type Site } from "../../lib/api";
import { formatRelative } from "../../lib/format";

export default function SitesListPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status) params.set("status", status);
      const d = await api.get<{ items: Site[]; total: number }>("/api/sites?" + params.toString());
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
  }, [q, status]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-bold text-[#0b3558]">Websites</h1>
          <p className="mt-1 text-sm text-[#476788]">{total} total</p>
        </div>
        <Link to="/dashboard/sites/new"><Button variant="primary">New website</Button></Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_200px]">
        <Input placeholder="Search by title or slug..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
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
                  <Link to={"/dashboard/sites/" + s.id + "/editor"} className="font-medium text-[#0b3558] hover:text-[#006bff]">{s.title}</Link>
                  <div className="text-xs text-[#476788]">{s.slug} &middot; updated {formatRelative(s.updated_at)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={s.status === "active" ? "success" : s.status === "suspended" ? "danger" : "neutral"}>{s.status}</Badge>
                  <Link to={"/dashboard/sites/" + s.id + "/editor"}><Button variant="outline" size="sm">Edit</Button></Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
