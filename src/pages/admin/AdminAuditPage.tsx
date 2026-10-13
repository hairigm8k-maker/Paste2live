import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Spinner";
import { api } from "../../lib/api";
import { formatDateTime } from "../../lib/format";

interface AuditEntry {
  id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  reason: string | null;
  created_at: number;
  actor_email: string | null;
}

export default function AdminAuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ items: AuditEntry[]; total: number }>("/api/admin/audit")
      .then((d) => { setEntries(d.items); setTotal(d.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-[#0b3558]">Audit log</h1>
        <span className="text-sm text-[#476788]">{total} entries</span>
      </div>
      <Card className="mt-6 p-0">
        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : entries.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#476788]">No admin actions recorded yet.</div>
        ) : (
          <ul className="divide-y divide-[#d4e0ed]">
            {entries.map((e) => (
              <li key={e.id} className="px-6 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-[#0b3558]">{e.action}</div>
                  <div className="text-xs text-[#476788]">{formatDateTime(e.created_at)}</div>
                </div>
                <div className="mt-1 text-xs text-[#476788]">
                  {e.actor_email || "unknown"} &middot; {e.target_type || "?"} {e.target_id ? e.target_id.slice(0, 8) : ""}
                  {e.reason ? " — " + e.reason : ""}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
