"use client";

import { useState, useEffect } from "react";

const FIELDS = [
  { key: "name",        label: "Restaurant Name",    placeholder: "Hentak." },
  { key: "tagline",     label: "Tagline",            placeholder: "Nouvelle Manipuri Cuisine" },
  { key: "address",     label: "Address",            placeholder: "Imphal, Manipur, India" },
  { key: "phone",       label: "Phone Number",       placeholder: "+91 98621 00000" },
  { key: "email",       label: "Email Address",      placeholder: "hello@hentakrestaurant.com" },
  { key: "instagram",   label: "Instagram URL",      placeholder: "https://instagram.com/hentak_restaurant" },
  { key: "description", label: "About Description",  placeholder: "A contemporary dining experience…", multiline: true },
];

export default function AdminSettingsPage() {
  const [values,  setValues]  = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then(j => { setValues(j.settings ?? {}); setLoading(false); });
  }, []);

  async function save() {
    setSaving(true); setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: values }),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const inp = "w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-ink-600 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent";

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-black text-xl text-white uppercase tracking-tight">Settings</h1>
        <button onClick={save} disabled={saving || loading}
          className={`px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-colors ${
            saved ? "bg-green-700 text-white" : "bg-saffron-600 hover:bg-saffron-500 text-white"
          } disabled:opacity-60`}>
          {saving ? "Saving…" : saved ? "✓ Saved" : "Save"}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-ink-500">Loading…</div>
      ) : (
        <div className="space-y-5">
          {FIELDS.map(({ key, label, placeholder, multiline }) => (
            <div key={key}>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-ink-400 mb-1.5">{label}</label>
              {multiline ? (
                <textarea
                  value={values[key] ?? ""}
                  onChange={e => setValues(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  rows={3}
                  className={`${inp} resize-none`}
                />
              ) : (
                <input
                  value={values[key] ?? ""}
                  onChange={e => setValues(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className={inp}
                />
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-ink-800">
            <p className="text-ink-500 text-xs">Changes update the live website. No restart needed.</p>
          </div>
        </div>
      )}
    </div>
  );
}
