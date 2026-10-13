import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f9fb] px-6 text-center">
      <div className="text-[80px] font-bold text-[#0b3558]">404</div>
      <p className="mt-2 text-[#476788]">This page does not exist.</p>
      <div className="mt-8"><Link to="/"><Button variant="primary">Back home</Button></Link></div>
    </div>
  );
}
