import { Card } from "../../components/ui/Card";
import { useAuth } from "../../lib/auth";
import { Badge } from "../../components/ui/Badge";

export default function SettingsPage() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-[28px] font-bold text-[#0b3558]">Account settings</h1>
      <Card>
        <h2 className="text-[18px] font-semibold text-[#0b3558]">Profile</h2>
        <div className="mt-4 space-y-3 text-sm">
          <div><span className="text-[#476788]">Email:</span> <span className="text-[#0b3558]">{user.email}</span></div>
          <div><span className="text-[#476788]">Name:</span> <span className="text-[#0b3558]">{user.name || "—"}</span></div>
          <div className="flex items-center gap-2">
            <span className="text-[#476788]">Email verified:</span>
            {user.email_verified ? <Badge variant="success">Yes</Badge> : <Badge variant="warning">Not yet</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#476788]">Role:</span>
            <Badge variant="info">{user.role}</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
