"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res  = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { router.push("/admin"); router.refresh(); }
    else        { setError("Wrong password. Try again."); setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Image src="/hentak-logo.jpg" alt="Hentak" width={56} height={56} className="object-contain" />
          </div>
          <h1 className="text-white font-black text-2xl tracking-widest uppercase">HENTAK.</h1>
          <p className="text-ink-500 text-xs tracking-widest uppercase mt-1">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-ink-900 rounded-2xl border border-ink-700 p-7 space-y-5">
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-ink-400 mb-1.5">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoFocus
              className="w-full bg-ink-800 border border-ink-600 rounded-lg px-4 py-3 text-white placeholder-ink-600 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent text-sm"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-saffron-600 hover:bg-saffron-500 disabled:opacity-60 text-white font-bold tracking-widest uppercase text-xs rounded-lg transition-colors"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-ink-700 text-xs mt-6">
          <a href="/" className="hover:text-ink-400 transition-colors">← Back to website</a>
        </p>
      </div>
    </div>
  );
}
