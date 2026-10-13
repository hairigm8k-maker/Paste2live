import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PublicNav } from "../../components/layout/PublicNav";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { api, ApiError } from "../../lib/api";
import { useAuth } from "../../lib/auth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refresh } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const data = await api.post<{ user: { email: string }; email_sent: boolean; email_error?: string }>(
        "/api/auth/register",
        { email, password, name }
      );
      await refresh();
      if (!data.email_sent) {
        setInfo("Account created. Email verification is not configured — you can continue.");
        setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <PublicNav />
      <main className="mx-auto flex max-w-md flex-col px-4 py-12 sm:py-20">
        <h1 className="text-[32px] font-bold text-[#0b3558]">Create your account</h1>
        <p className="mt-2 text-sm text-[#476788]">Start publishing in under a minute.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <Alert variant="error">{error}</Alert>}
          {info && <Alert variant="info">{info}</Alert>}
          <Input
            label="Name"
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            Create account
          </Button>
        </form>

        <div className="relative my-6 text-center text-xs uppercase text-[#a6bbd1]">
          <span className="relative z-10 bg-[#f8f9fb] px-2">or</span>
          <div className="absolute inset-x-0 top-1/2 h-px bg-[#d4e0ed]" />
        </div>

        <a href="/api/auth/google/start" className="flex w-full items-center justify-center gap-3 rounded-[8px] border border-[#d4e0ed] bg-white px-4 py-3 text-[15px] font-medium text-[#0b3558] hover:bg-[#f0f3f8]">
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Continue with Google
        </a>

        <p className="mt-8 text-center text-sm text-[#476788]">
          Already have an account? <Link to="/login" className="font-medium text-[#006bff] hover:underline">Sign in</Link>
        </p>
      </main>
    </div>
  );
}
