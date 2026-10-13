import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { html as htmlLang } from "@codemirror/lang-html";
import { css as cssLang } from "@codemirror/lang-css";
import { javascript as jsLang } from "@codemirror/lang-javascript";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Alert } from "../../components/ui/Alert";
import { Spinner } from "../../components/ui/Spinner";
import { api, ApiError, type Site, type Draft } from "../../lib/api";
import { siteUrl } from "../../lib/format";

type Tab = "html" | "css" | "js";

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();

  const [site, setSite] = useState<Site | null>(null);
  const [draft, setDraft] = useState<Draft>({ html: "", css: "", js: "" });
  const [tab, setTab] = useState<Tab>("html");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<"idle" | "pending" | "saved" | "error">("idle");
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const saveTimeout = useRef<number | null>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get<{ site: Site; draft: Draft | null }>("/api/sites/" + id),
    ])
      .then(([data]) => {
        setSite(data.site);
        if (data.draft) setDraft(data.draft);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (loading) return;
    if (saveTimeout.current) window.clearTimeout(saveTimeout.current);
    setSaving("pending");
    saveTimeout.current = window.setTimeout(() => {
      if (!id) return;
      api.patch("/api/sites/" + id + "/draft", draft)
        .then(() => setSaving("saved"))
        .catch(() => setSaving("error"));
    }, 1000);
    return () => { if (saveTimeout.current) window.clearTimeout(saveTimeout.current); };
  }, [draft, id, loading]);

  function updatePreview() {
    if (!previewRef.current) return;
    const doc = previewRef.current.contentDocument;
    if (!doc) return;
    let html = draft.html || "<!doctype html><html><body><p>No content yet.</p></body></html>";
    if (draft.css && html.includes("</head>")) {
      html = html.replace("</head>", "<style>" + draft.css + "</style></head>");
    }
    if (draft.js && html.includes("</body>")) {
      html = html.replace("</body>", "<script>" + draft.js + "<\/script></body>");
    }
    doc.open(); doc.write(html); doc.close();
  }

  useEffect(() => { updatePreview(); }, [draft]);

  async function handlePublish() {
    if (!id) return;
    setPublishing(true);
    setError("");
    setMessage("");
    try {
      const result = await api.post<{ release_number: number; url: string }>("/api/sites/" + id + "/publish");
      setMessage("Published release #" + result.release_number + " to " + result.url);
      if (site) setSite({ ...site, status: "active" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Publish failed");
    } finally {
      setPublishing(false);
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>;
  if (!site) return <Alert variant="error">Site not found</Alert>;

  return (
    <div className="mx-auto flex max-w-7xl flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-bold text-[#0b3558]">{site.title}</h1>
            <Badge variant={site.status === "active" ? "success" : site.status === "suspended" ? "danger" : "neutral"}>{site.status}</Badge>
          </div>
          <div className="mt-1 text-xs text-[#476788]">
            {site.slug} &middot; {saving === "saved" ? "Saved" : saving === "pending" ? "Saving..." : saving === "error" ? "Save failed" : ""}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={"/dashboard/sites/" + site.id + "/releases"}><Button variant="outline" size="sm">Releases</Button></Link>
          <Link to={"/dashboard/sites/" + site.id + "/settings"}><Button variant="outline" size="sm">Settings</Button></Link>
          <Button variant="primary" size="sm" onClick={handlePublish} loading={publishing}>Publish</Button>
        </div>
      </div>

      {message && <div className="mt-4"><Alert variant="success">{message}</Alert></div>}
      {error && <div className="mt-4"><Alert variant="error">{error}</Alert></div>}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col overflow-hidden rounded-[16px] border border-[#d4e0ed] bg-white">
          <div className="flex border-b border-[#d4e0ed]">
            {(["html", "css", "js"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={
                  "px-4 py-2.5 text-sm font-medium uppercase transition " +
                  (tab === t ? "border-b-2 border-[#006bff] text-[#006bff]" : "text-[#476788] hover:text-[#0b3558]")
                }
              >
                {t}
              </button>
            ))}
          </div>
          <div className="min-h-[400px] flex-1">
            <CodeMirror
              value={draft[tab]}
              onChange={(v) => setDraft({ ...draft, [tab]: v })}
              extensions={tab === "html" ? [htmlLang()] : tab === "css" ? [cssLang()] : [jsLang()]}
              height="400px"
              basicSetup={{ lineNumbers: true, foldGutter: true, highlightActiveLine: true }}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[16px] border border-[#d4e0ed] bg-white">
          <div className="flex items-center justify-between border-b border-[#d4e0ed] px-4 py-2.5">
            <span className="text-xs font-medium uppercase text-[#476788]">Live preview</span>
            <a href={siteUrl(site.slug)} target="_blank" rel="noreferrer" className="text-xs text-[#006bff] hover:underline">
              Open live site
            </a>
          </div>
          <iframe
            ref={previewRef}
            sandbox="allow-scripts"
            title="Preview"
            className="h-[400px] w-full bg-white"
          />
        </div>
      </div>
    </div>
  );
}
