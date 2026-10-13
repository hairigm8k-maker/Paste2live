import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Spinner";
import { api } from "../../lib/api";

interface Stats {
  users: number;
  sites: number;
  active_sites: number;
  suspended_sites: number;
  total_releases: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Stats>("/api/admin/stats")
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-[28px] font-bold text-[#0b3558]">Admin overview</h1>
      <p className="mt-1 text-sm text-[#476788]">Platform-wide metrics.</p>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : !stats ? (
        <div className="py-20 text-center text-sm text-[#476788]">Could not load stats.</div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <div className="text-xs uppercase text-[#476788]">Total users</div>
            <div className="mt-2 text-[32px] font-bold text-[#0b3558]">{stats.users}</div>
          </Card>
          <Card>
            <div className="text-xs uppercase text-[#476788]">Total sites</div>
            <div className="mt-2 text-[32px] font-bold text-[#0b3558]">{stats.sites}</div>
          </Card>
          <Card>
            <div className="text-xs uppercase text-[#476788]">Active sites</div>
            <div className="mt-2 text-[32px] font-bold text-[#0b3558]">{stats.active_sites}</div>
          </Card>
          <Card>
            <div className="text-xs uppercase text-[#476788]">Suspended</div>
            <div className="mt-2 text-[32px] font-bold text-[#d92d20]">{stats.suspended_sites}</div>
          </Card>
          <Card>
            <div className="text-xs uppercase text-[#476788]">Total releases</div>
            <div className="mt-2 text-[32px] font-bold text-[#0b3558]">{stats.total_releases}</div>
          </Card>
          <Card>
            <div className="text-xs uppercase text-[#476788]">Revenue</div>
            <div className="mt-2 text-[20px] font-bold text-[#a6bbd1]">Not configured</div>
            <p className="mt-1 text-xs text-[#a6bbd1]">Payment gateway not integrated</p>
          </Card>
        </div>
      )}
    </div>
  );
}
