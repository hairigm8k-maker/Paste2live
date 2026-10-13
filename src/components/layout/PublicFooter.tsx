import { Link } from "react-router-dom";

export function PublicFooter() {
  return (
    <footer className="border-t border-[#d4e0ed] bg-[#f8f9fb]">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="text-[14px] font-semibold uppercase text-[#476788]">Product</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/" className="text-[#0b3558] hover:text-[#006bff]">Home</Link></li>
              <li><Link to="/pricing" className="text-[#0b3558] hover:text-[#006bff]">Pricing</Link></li>
              <li><Link to="/docs" className="text-[#0b3558] hover:text-[#006bff]">Docs</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-[14px] font-semibold uppercase text-[#476788]">Legal</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/terms" className="text-[#0b3558] hover:text-[#006bff]">Terms</Link></li>
              <li><Link to="/privacy" className="text-[#0b3558] hover:text-[#006bff]">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-[14px] font-semibold uppercase text-[#476788]">Contact</div>
            <p className="mt-3 text-sm text-[#0b3558]">
              Support: <a href="mailto:support@hairiamri.buzz" className="hover:text-[#006bff]">support@hairiamri.buzz</a>
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-[#d4e0ed] pt-6 text-xs text-[#476788]">
          &copy; {new Date().getFullYear()} Paste2Live. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
