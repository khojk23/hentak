"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface SlideImage {
  id: string; url: string; alt: string; active: boolean; sort_order: number;
}

export default function AdminSlideshowPage() {
  const [images,    setImages]    = useState<SlideImage[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const res  = await fetch("/api/admin/slideshow");
    const json = await res.json();
    setImages(json.images ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true); setError("");
    for (const file of files) {
      const form = new FormData();
      form.append("file", file);
      form.append("alt", file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
      const res = await fetch("/api/admin/slideshow", { method: "POST", body: form });
      if (!res.ok) { const j = await res.json(); setError(j.error ?? "Upload failed"); }
    }
    await load();
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function toggleActive(img: SlideImage) {
    await fetch(`/api/admin/slideshow/${img.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !img.active }),
    });
    setImages(prev => prev.map(i => i.id === img.id ? { ...i, active: !i.active } : i));
  }

  async function deleteImage(id: string) {
    if (!confirm("Remove this slide from the homepage?")) return;
    await fetch(`/api/admin/slideshow/${id}`, { method: "DELETE" });
    setImages(prev => prev.filter(i => i.id !== id));
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-black text-xl text-white uppercase tracking-tight">Hero Slideshow</h1>
          <p className="text-ink-500 text-xs mt-0.5">Images shown in the homepage carousel</p>
        </div>
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="px-4 py-2 bg-saffron-600 hover:bg-saffron-500 disabled:opacity-60 text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-colors flex items-center gap-2">
          {uploading
            ? <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Uploading…</>
            : "📤 Upload"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </div>

      <div className="mb-5 bg-saffron-950/30 border border-saffron-800/40 rounded-xl px-4 py-3 text-xs text-saffron-300">
        ✦ Upload landscape photos (16:9 ratio works best). Toggle the switch to show/hide each slide. Changes are live immediately.
      </div>

      {error && <p className="text-red-400 text-sm mb-4 bg-red-950/40 border border-red-800 rounded-lg px-3 py-2">{error}</p>}

      <button onClick={() => fileRef.current?.click()}
        className="w-full border-2 border-dashed border-ink-700 hover:border-saffron-600 rounded-xl py-8 mb-5 text-center transition-colors group">
        <p className="text-3xl mb-2">🖼</p>
        <p className="text-ink-400 text-sm group-hover:text-saffron-400 transition-colors">Tap to upload hero images</p>
        <p className="text-ink-600 text-xs mt-1">Best size: 1600 × 900px · JPG or WEBP</p>
      </button>

      {loading ? (
        <div className="text-center py-10 text-ink-500">Loading…</div>
      ) : images.length === 0 ? (
        <div className="text-center py-10 text-ink-600">
          No custom slides yet — the site uses default images.<br/>Upload your own to replace them.
        </div>
      ) : (
        <div className="space-y-3">
          {images.map((img, i) => (
            <div key={img.id} className={`flex items-center gap-3 bg-ink-900 border rounded-xl p-3 transition-colors ${img.active ? "border-ink-700" : "border-ink-800 opacity-50"}`}>
              <div className="relative w-24 h-14 rounded-lg overflow-hidden shrink-0 bg-ink-800">
                <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="96px" unoptimized />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{img.alt || `Slide ${i + 1}`}</p>
                <p className="text-ink-600 text-xs">{img.active ? "Showing on homepage" : "Hidden"}</p>
              </div>
              {/* Active toggle */}
              <button onClick={() => toggleActive(img)}
                className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${img.active ? "bg-green-600" : "bg-ink-700"}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${img.active ? "right-0.5" : "left-0.5"}`} />
              </button>
              <button onClick={() => deleteImage(img.id)} className="text-ink-600 hover:text-red-400 transition-colors shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
