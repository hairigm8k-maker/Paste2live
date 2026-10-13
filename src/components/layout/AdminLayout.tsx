import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { Button } from "../ui/Button";

const adminNav = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/users", label: "Users", exact: false },
  { to: "/admin/sites", label: "Sites", exact: false },
  { to: "/admin/audit", label: "Audit Log", exact: false },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <aside className="hidden w-64 shrink-0 border-r border-[#d4e0ed] bg-[#0b3558] md:flex md:flex-col">
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <Link to="/admin" className="flex items-center gap-2 text-[16px] font-bold text-white">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-white text-[#0b3558] text-sm">A</span>
            Admin
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                "block rounded-[8px] px-3 py-2 text-sm font-medium transition " +
                (isActive ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white")
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/dashboard" className="mt-4 block rounded-[8px] px-3 py-2 text-xs font-medium text-white/60 hover:text-white">
            &larr; Back to dashboard
          </Link>
        </nav>
        <div className="border-t border-white/10 p-3">
          <div className="mb-2 truncate px-3 text-xs text-white/60">{user.email}</div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>Sign out</Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-[#d4e0ed] bg-white px-4 md:hidden">
          <Link to="/admin" className="font-bold text-[#0b3558]">Admin</Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>Sign out</Button>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
