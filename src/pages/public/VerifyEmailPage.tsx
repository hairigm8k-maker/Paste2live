import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PublicNav } from "../../components/layout/PublicNav";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { api, ApiError } from "../../lib/api";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!token) { setState("error"); setMessage("No verification token provided."); return; }
    api.post("/api/auth/verify", { token }).then(() => setState("ok")).catch((err) => { setState("error"); setMessage(err instanceof ApiError ? err.message : "Verification failed"); });
  }, [token]);
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <PublicNav />
      <main className="mx-auto flex max-w-md flex-col px-4 py-20">
        <h1 className="text-[32px] font-bold text-[#0b3558]">Email verification</h1>
        <div className="mt-8">
          {state === "loading" && <Spinner size={28} />}
          {state === "ok" && (<><Alert variant="success">Your email is verified.</Alert><div className="mt-6"><Link to="/dashboard"><Button variant="primary">Go to dashboard</Button></Link></div></>)}
          {state === "error" && (<><Alert variant="error">{message}</Alert><div className="mt-6"><Link to="/login"><Button variant="outline">Back to sign in</Button></Link></div></>)}
        </div>
      </main>
    </div>
  );
}
