import { useEffect, useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { Spinner } from "../../components/ui/Spinner";
import { api, ApiError, type Site } from "../../lib/api";

export default function SiteSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [site, setSite] = useState<Site | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    if (!id) return;
    api.get<{ site: Site }>("/api/sites/" + id)
      .then((d) => { setSite(d.site); setTitle(d.site.title); setDescription(d.site.description || ""); })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setSaving(true); setError(""); setMessage("");
    try {
      await api.patch("/api/sites/" + id, { title, description });
      setMessage("Saved.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!id || deleteConfirm !== site?.slug) return;
    try {
      await api.del("/api/sites/" + id);
      navigate("/dashboard/sites");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>;
  if (!site) return <Alert variant="error">Site not found</Alert>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-[28px] font-bold text-[#0b3558]">Site settings</h1>

      <Card>
        <form onSubmit={handleSave} className="space-y-4">
          <h2 className="text-[18px] font-semibold text-[#0b3558]">General</h2>
          {error && <Alert variant="error">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120} />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} />
          <div>
            <label className="text-sm font-medium text-[#0b3558]">Slug (read-only)</label>
            <div className="mt-1 rounded-[8px] border border-[#d4e0ed] bg-[#f0f3f8] px-3 py-2.5 font-mono text-sm text-[#476788]">{site.slug}</div>
          </div>
          <div className="flex justify-end"><Button type="submit" variant="primary" loading={saving}>Save changes</Button></div>
        </form>
      </Card>

      <Card>
        <h2 className="text-[18px] font-semibold text-[#d92d20]">Danger zone</h2>
        <p className="mt-2 text-sm text-[#476788]">
          Deleting this site removes all drafts, releases, and analytics. This cannot be undone.
        </p>
        <div className="mt-4 space-y-3">
          <Input
            label={"Type the slug (" + site.slug + ") to confirm"}
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder={site.slug}
          />
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteConfirm !== site.slug}
          >
            Delete website
          </Button>
        </div>
      </Card>
    </div>
  );
}
