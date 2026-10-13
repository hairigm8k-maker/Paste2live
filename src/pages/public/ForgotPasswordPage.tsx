import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { PublicNav } from "../../components/layout/PublicNav";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { api, ApiError } from "../../lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try { await api.post("/api/auth/forgot-password", { email }); setSent(true); }
    catch (err) { setError(err instanceof ApiError ? err.message : "Request failed"); }
    finally { setLoading(false); }
  }
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <PublicNav />
      <main className="mx-auto flex max-w-md flex-col px-4 py-20">
        <h1 className="text-[32px] font-bold text-[#0b3558]">Reset your password</h1>
        <p className="mt-2 text-sm text-[#476788]">We'll send a reset link to your email.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <Alert variant="error">{error}</Alert>}
          {sent && <Alert variant="success">If that email exists, a reset link has been sent.</Alert>}
          <Input label="Email" type="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">Send reset link</Button>
        </form>
        <p className="mt-8 text-center text-sm text-[#476788]"><Link to="/login" className="font-medium text-[#006bff] hover:underline">Back to sign in</Link></p>
      </main>
    </div>
  );
}
