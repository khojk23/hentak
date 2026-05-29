"use client";

import { useState } from "react";

export default function SeedButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function seed() {
    setStatus("loading");
    const res = await fetch("/api/admin/seed", { method: "POST" });
    const json = await res.json();
    setStatus("done");
    alert(json.message ?? "Done! Refresh the page to see updated counts.");
  }

  return (
    <button
      onClick={seed}
      disabled={status !== "idle"}
      className="px-4 py-2 bg-saffron-700 hover:bg-saffron-600 disabled:opacity-60 text-white text-xs font-bold tracking-widest uppercase rounded transition-colors"
    >
      {status === "loading" ? "Seeding…" : status === "done" ? "✓ Seeded" : "Seed Database"}
    </button>
  );
}
