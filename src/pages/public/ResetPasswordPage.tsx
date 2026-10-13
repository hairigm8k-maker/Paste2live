import { useState, type FormEvent } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { PublicNav } from "../../components/layout/PublicNav";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { api, ApiError } from "../../lib/api";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError("");
    if (!token) { setError("Missing reset token"); return; }
    setLoading(true);
    try { await api.post("/api/auth/reset-password", { token, password }); navigate("/login", { replace: true }); }
    catch (err) { setError(err instanceof ApiError ? err.message : "Reset failed"); }
    finally { setLoading(false); }
  }
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <PublicNav />
      <main className="mx-auto flex max-w-md flex-col px-4 py-20">
        <h1 className="text-[32px] font-bold text-[#0b3558]">Set a new password</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <Alert variant="error">{error}</Alert>}
          <Input label="New password" type="password" name="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">Update password</Button>
        </form>
        <p className="mt-8 text-center text-sm text-[#476788]"><Link to="/login" className="font-medium text-[#006bff] hover:underline">Back to sign in</Link></p>
      </main>
    </div>
  );
}
