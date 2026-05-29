"use client";

import { useState, useEffect } from "react";
import type { OpeningHour } from "@/lib/supabase";

export default function AdminHoursPage() {
  const [hours,   setHours]   = useState<OpeningHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    fetch("/api/admin/hours")
      .then(r => r.json())
      .then(j => { setHours(j.hours ?? []); setLoading(false); });
  }, []);

  function update(id: string, field: "is_open" | "hours", value: boolean | string) {
    setHours(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));
  }

  async function save() {
    setSaving(true); setSaved(false);
    await fetch("/api/admin/hours", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hours: hours.map(({ id, is_open, hours: h }) => ({ id, is_open, hours: h })) }),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-black text-xl text-white uppercase tracking-tight">Opening Hours</h1>
        <button onClick={save} disabled={saving}
          className={`px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-colors ${
            saved ? "bg-green-700 text-white" : "bg-saffron-600 hover:bg-saffron-500 text-white"
          } disabled:opacity-60`}>
          {saving ? "Saving…" : saved ? "✓ Saved" : "Save"}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-ink-500">Loading…</div>
      ) : (
        <div className="space-y-2">
          {hours.map(h => (
            <div key={h.id}
              className={`bg-ink-900 border rounded-xl px-4 py-4 transition-colors ${h.is_open ? "border-ink-700" : "border-ink-800 opacity-60"}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold text-sm">{h.day}</span>
                {/* Toggle */}
                <button onClick={() => update(h.id, "is_open", !h.is_open)}
                  className={`w-11 h-6 rounded-full relative transition-colors ${h.is_open ? "bg-green-600" : "bg-ink-700"}`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${h.is_open ? "right-1" : "left-1"}`} />
                </button>
              </div>
              {h.is_open && (
                <input
                  value={h.hours}
                  onChange={e => update(h.id, "hours", e.target.value)}
                  className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                  placeholder="e.g. 12:00 PM – 3:00 PM, 6:30 PM – 10:00 PM"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-ink-600 text-xs mt-5 text-center">Changes apply to the website immediately after saving.</p>
    </div>
  );
}
