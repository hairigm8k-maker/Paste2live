import { Link } from "react-router-dom";
import { PublicNav } from "../../components/layout/PublicNav";
import { PublicFooter } from "../../components/layout/PublicFooter";
import { Button } from "../../components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <PublicNav />

      <section className="relative overflow-hidden px-4 pt-16 sm:px-6 sm:pt-24">
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#e55cff] opacity-20 blur-3xl" />
        <div className="absolute -left-32 top-40 h-96 w-96 rounded-full bg-[#0099ff] opacity-20 blur-3xl" />

        <div className="relative mx-auto max-w-[1200px]">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e6f0ff] px-3 py-1 text-xs font-medium text-[#004eba]">
                New — Subdomain publishing is live
              </div>
              <h1 className="mt-6 text-[44px] font-bold leading-[1.15] text-[#0b3558] sm:text-[68px]">
                Paste HTML.
                <br />
                Publish instantly.
              </h1>
              <p className="mt-6 max-w-lg text-[18px] text-[#476788]">
                Turn any HTML, CSS, and JavaScript into a live website with a unique subdomain — no build tools, no hosting setup.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register">
                  <Button variant="primary" size="lg">Start for free</Button>
                </Link>
                <Link to="/login">
                  <Button variant="dark" size="lg">Sign in</Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-[#476788]">No credit card required.</p>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[24px] bg-gradient-to-br from-[#e55cff]/30 to-[#0099ff]/30 blur-2xl" />
              <div className="relative rounded-[16px] border border-[#d4e0ed] bg-white shadow-[rgba(71,103,136,0.08)_0px_30px_50px_0px]">
                <div className="flex items-center gap-2 border-b border-[#d4e0ed] px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 text-xs text-[#476788]">my-portfolio.sites.hairiamri.buzz</span>
                </div>
                <pre className="overflow-hidden p-4 text-xs text-[#0b3558]">
{`<!doctype html>
<html>
  <head>
    <title>My Portfolio</title>
  </head>
  <body>
    <h1>Hello, world.</h1>
  </body>
</html>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <h2 className="text-[38px] font-bold text-[#0b3558] sm:text-[50px]">Everything you need to ship fast</h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] text-[#476788]">
            Built for developers, designers, and anyone who needs to publish HTML quickly.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { t: "Paste & publish", d: "Drop your HTML, CSS, and JS. Click publish. Get a live URL in seconds." },
            { t: "Live preview", d: "See exactly what your site looks like before you publish, in an isolated sandbox." },
            { t: "Version history", d: "Every publish is a snapshot. Roll back to any previous version anytime." },
            { t: "Automatic subdomain", d: "Every site gets a unique subdomain. No DNS setup required." },
            { t: "Secure by default", d: "Isolated origins, HTTPS, security headers, and abuse protection." },
            { t: "AI assistant", d: "Built-in chatbot helps with syntax, slug ideas, and best practices." },
          ].map((f) => (
            <div key={f.t} className="rounded-[16px] border border-[#d4e0ed] bg-white p-6">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#e6f0ff] text-[#006bff] font-bold">&#9679;</div>
              <h3 className="text-[18px] font-semibold text-[#0b3558]">{f.t}</h3>
              <p className="mt-2 text-sm text-[#476788]">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#d4e0ed] bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-4 text-center sm:px-6">
          <h2 className="text-[38px] font-bold text-[#0b3558] sm:text-[50px]">Ready to publish?</h2>
          <p className="mx-auto mt-4 max-w-lg text-[16px] text-[#476788]">
            Create your first site in under a minute.
          </p>
          <div className="mt-8">
            <Link to="/register">
              <Button variant="primary" size="lg">Get started free</Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
