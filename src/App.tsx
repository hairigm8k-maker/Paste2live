import { Routes, Route, Link } from "react-router-dom";

function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-[50px] md:text-[68px] font-bold leading-tight text-[#0b3558]">
          Paste HTML.
          <br />
          Publish instantly.
        </h1>
        <p className="mt-6 text-[18px] text-[#476788]">
          Turn any HTML, CSS, and JavaScript into a live website in seconds.
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link
            to="/register"
            className="px-6 py-3 rounded-[8px] bg-[#006bff] text-white text-[18px] font-semibold hover:opacity-90"
          >
            Get started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-[8px] bg-[#0b3558] text-white text-[18px] font-semibold hover:opacity-90"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
