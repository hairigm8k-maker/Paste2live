import { PublicNav } from "../../components/layout/PublicNav";
import { PublicFooter } from "../../components/layout/PublicFooter";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <PublicNav />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-[38px] font-bold text-[#0b3558]">Documentation</h1>
        <div className="mt-8 space-y-8 text-[#0b3558]">
          <section>
            <h2 className="text-[24px] font-semibold">Getting started</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-6 text-[#476788]">
              <li>Create an account and verify your email.</li>
              <li>Click "New website" and choose a unique slug.</li>
              <li>Paste your HTML, CSS, and JavaScript.</li>
              <li>Click Publish. Your site goes live on your subdomain.</li>
            </ol>
          </section>
          <section>
            <h2 className="text-[24px] font-semibold">Subdomains</h2>
            <p className="mt-3 text-[#476788]">Every site gets a unique subdomain like my-site.sites.hairiamri.buzz. Slugs must be 3-40 characters, lowercase, letters/numbers/hyphens.</p>
          </section>
          <section>
            <h2 className="text-[24px] font-semibold">Version history</h2>
            <p className="mt-3 text-[#476788]">Each publish creates an immutable release. Roll back anytime.</p>
          </section>
          <section>
            <h2 className="text-[24px] font-semibold">Security</h2>
            <p className="mt-3 text-[#476788]">User sites are served from an isolated origin. Dashboard session is never exposed to published content.</p>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
