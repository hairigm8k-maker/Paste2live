import { Link } from "react-router-dom";
import { PublicNav } from "../../components/layout/PublicNav";
import { PublicFooter } from "../../components/layout/PublicFooter";
import { Button } from "../../components/ui/Button";

const plans = [
  { name: "Free", price: "RM0", features: ["1 website", "10 MB storage", "100 MB bandwidth", "Community support"] },
  { name: "Pro", price: "RM19", features: ["20 websites", "1 GB storage", "10 GB bandwidth", "Priority support"], popular: true },
  { name: "Business", price: "RM49", features: ["100 websites", "10 GB storage", "100 GB bandwidth", "Custom domains"] },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <PublicNav />
      <main className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <h1 className="text-[38px] font-bold text-[#0b3558] sm:text-[50px]">Simple, transparent pricing</h1>
          <p className="mx-auto mt-4 max-w-xl text-[16px] text-[#476788]">Start free. Upgrade when you need more.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={"rounded-[24px] bg-white p-8 " + (p.popular ? "border-2 border-[#006bff]" : "border border-[#d4e0ed]")}>
              {p.popular && <div className="mb-3 inline-block rounded-full bg-[#e6f0ff] px-3 py-1 text-xs font-medium text-[#004eba]">Most popular</div>}
              <h3 className="text-[20px] font-semibold text-[#0b3558]">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-[38px] font-bold text-[#0b3558]">{p.price}</span>
                <span className="text-sm text-[#476788]">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-[#476788]">
                {p.features.map((f) => <li key={f} className="flex items-center gap-2"><span className="text-[#006bff]">&#10003;</span>{f}</li>)}
              </ul>
              <div className="mt-8"><Link to="/register"><Button variant={p.popular ? "primary" : "outline"} className="w-full">Get started</Button></Link></div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-[#476788]">Billing integration is not yet configured.</p>
      </main>
      <PublicFooter />
    </div>
  );
}
