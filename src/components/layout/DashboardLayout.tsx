import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { Button } from "../ui/Button";

const navItems = [
  { to: "/dashboard", label: "Overview", exact: true },
  { to: "/dashboard/sites", label: "Websites", exact: false },
  { to: "/dashboard/settings", label: "Settings", exact: false },
];

function isAdmin(role: string, isSuper: boolean | undefined) {
  return isSuper || ["super_admin", "admin", "moderator", "support"].includes(role);
}

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <aside className="hidden w-64 shrink-0 border-r border-[#d4e0ed] bg-white md:flex md:flex-col">
        <div className="flex h-16 items-center border-b border-[#d4e0ed] px-6">
          <Link to="/dashboard" className="flex items-center gap-2 text-[16px] font-bold text-[#0b3558]">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#0b3558] text-white text-sm">P</span>
            Paste2Live
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                "block rounded-[8px] px-3 py-2 text-sm font-medium transition " +
                (isActive ? "bg-[#e6f0ff] text-[#004eba]" : "text-[#0b3558] hover:bg-[#f0f3f8]")
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAdmin(user.role, user.is_super_admin) && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                "block rounded-[8px] px-3 py-2 text-sm font-medium transition " +
                (isActive ? "bg-[#e6f0ff] text-[#004eba]" : "text-[#0b3558] hover:bg-[#f0f3f8]")
              }
            >
              Admin Panel
            </NavLink>
          )}
        </nav>
        <div className="border-t border-[#d4e0ed] p-3">
          <div className="mb-2 truncate px-3 text-xs text-[#476788]">{user.email}</div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>Sign out</Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-[#d4e0ed] bg-white px-4 md:hidden">
          <Link to="/dashboard" className="font-bold text-[#0b3558]">Paste2Live</Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>Sign out</Button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-[#d4e0ed] bg-white px-2 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                "whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium " +
                (isActive ? "border-[#006bff] text-[#006bff]" : "border-transparent text-[#476788]")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
