import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { api, ApiError } from "../../lib/api";

export default function NewSitePage() {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const baseDomain = import.meta.env.VITE_SITE_BASE_DOMAIN || "sites.example.com";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.post<{ id: string }>("/api/sites", {
        slug: slug.trim().toLowerCase(),
        title: title.trim(),
        description: description.trim(),
      });
      navigate("/dashboard/sites/" + data.id + "/editor");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create site");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-[28px] font-bold text-[#0b3558]">New website</h1>
      <p className="mt-1 text-sm text-[#476788]">Choose a unique name and slug for your site.</p>

      <Card className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <Alert variant="error">{error}</Alert>}

          <Input
            label="Site title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Portfolio"
            required
            maxLength={120}
          />

          <div>
            <Input
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              placeholder="my-portfolio"
              required
              maxLength={40}
            />
            <p className="mt-1.5 text-xs text-[#476788]">
              Your site will be live at: <span className="font-mono text-[#0b3558]">https://{slug || "your-slug"}.{baseDomain}</span>
            </p>
            <p className="mt-1 text-xs text-[#a6bbd1]">
              3-40 characters, lowercase letters, numbers, and hyphens only.
            </p>
          </div>

          <Input
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description of your site"
            maxLength={300}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => navigate("/dashboard/sites")}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading}>Create site</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
