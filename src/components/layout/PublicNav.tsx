import { Link } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { Button } from "../ui/Button";

export function PublicNav() {
  const { user, loading } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-[#d4e0ed] bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-[18px] font-bold text-[#0b3558]">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#0b3558] text-white text-sm font-bold">P</span>
          Paste2Live
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-[#0b3558] sm:flex">
          <Link to="/pricing" className="hover:text-[#006bff]">Pricing</Link>
          <Link to="/docs" className="hover:text-[#006bff]">Docs</Link>
        </nav>
        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            <Link to="/dashboard">
              <Button variant="primary" size="sm">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
