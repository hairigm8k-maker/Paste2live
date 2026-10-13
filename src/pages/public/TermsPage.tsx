import { PublicNav } from "../../components/layout/PublicNav";
import { PublicFooter } from "../../components/layout/PublicFooter";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <PublicNav />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-[38px] font-bold text-[#0b3558]">Terms of Service</h1>
        <p className="mt-6 text-sm text-[#476788]">Last updated: {new Date().toLocaleDateString("en-MY")}</p>
        <div className="mt-8 space-y-4 text-[#0b3558]">
          <p>By using Paste2Live you agree to these terms. Do not host illegal, malicious, or abusive content.</p>
          <p>You are responsible for content you publish. We may remove content that violates these terms.</p>
          <p>Service is provided as-is without warranties.</p>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
