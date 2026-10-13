import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Alert } from "../../components/ui/Alert";
import { Spinner } from "../../components/ui/Spinner";
import { api, ApiError, type Release, type Site } from "../../lib/api";
import { formatDateTime } from "../../lib/format";

export default function ReleasesPage() {
  const { id } = useParams<{ id: string }>();
  const [releases, setReleases] = useState<Release[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    if (!id) return;
    try {
      const [siteData, relData] = await Promise.all([
        api.get<{ site: Site }>("/api/sites/" + id),
        api.get<{ releases: Release[]; current_release_id: string | null }>("/api/sites/" + id + "/releases"),
      ]);
      setSite(siteData.site);
      setReleases(relData.releases);
      setCurrent(relData.current_release_id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function handleRollback(releaseId: string) {
    if (!id) return;
    try {
      await api.post("/api/sites/" + id + "/rollback", { release_id: releaseId });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Rollback failed");
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#0b3558]">Releases</h1>
          <p className="mt-1 text-sm text-[#476788]">{site?.title}</p>
        </div>
        <Link to={"/dashboard/sites/" + id + "/editor"}><Button variant="outline" size="sm">Back to editor</Button></Link>
      </div>

      {error && <div className="mt-4"><Alert variant="error">{error}</Alert></div>}

      <Card className="mt-6 p-0">
        {releases.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#476788]">No releases yet. Publish your site to create the first release.</div>
        ) : (
          <ul className="divide-y divide-[#d4e0ed]">
            {releases.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#0b3558]">Release #{r.release_number}</span>
                    {r.id === current && <Badge variant="success">Current</Badge>}
                  </div>
                  <div className="text-xs text-[#476788]">{formatDateTime(r.created_at)} &middot; {r.content_hash.slice(0, 12)}</div>
                </div>
                {r.id !== current && (
                  <Button variant="outline" size="sm" onClick={() => handleRollback(r.id)}>Rollback</Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
