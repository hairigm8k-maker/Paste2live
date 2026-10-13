import { PublicNav } from "../../components/layout/PublicNav";
import { PublicFooter } from "../../components/layout/PublicFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <PublicNav />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-[38px] font-bold text-[#0b3558]">Privacy Policy</h1>
        <p className="mt-6 text-sm text-[#476788]">Last updated: {new Date().toLocaleDateString("en-MY")}</p>
        <div className="mt-8 space-y-4 text-[#0b3558]">
          <p>We collect email, name, and site content you choose to publish. We do not sell your data.</p>
          <p>Sessions are stored in HTTP-only cookies and expire after 30 days. Tokens are hashed and time-limited.</p>
          <p>Published sites are publicly accessible.</p>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
