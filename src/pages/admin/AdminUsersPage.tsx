import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { api } from "../../lib/api";
import { formatDate } from "../../lib/format";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  email_verified_at: number | null;
  created_at: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [q, setQ] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      const d = await api.get<{ items: AdminUser[]; total: number }>("/api/admin/users?" + params.toString());
      setUsers(d.items);
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
  }, [q]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-[#0b3558]">Users</h1>
        <span className="text-sm text-[#476788]">{total} total</span>
      </div>
      <div className="mt-6">
        <Input placeholder="Search by email or name..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <Card className="mt-4 p-0">
        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#476788]">No users found.</div>
        ) : (
          <ul className="divide-y divide-[#d4e0ed]">
            {users.map((u) => (
              <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div>
                  <div className="font-medium text-[#0b3558]">{u.name || u.email}</div>
                  <div className="text-xs text-[#476788]">{u.email} &middot; joined {formatDate(u.created_at)}</div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="info">{u.role}</Badge>
                  <Badge variant={u.status === "active" ? "success" : "danger"}>{u.status}</Badge>
                  {u.email_verified_at ? <Badge variant="success">verified</Badge> : <Badge variant="warning">unverified</Badge>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
