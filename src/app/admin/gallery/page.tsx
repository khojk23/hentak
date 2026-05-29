"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/supabase";

export default function AdminGalleryPage() {
  const [images,   setImages]   = useState<GalleryImage[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [uploading,setUploading]= useState(false);
  const [error,    setError]    = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const res  = await fetch("/api/admin/gallery");
    const json = await res.json();
    setImages(json.images ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true); setError("");
    try {
      for (const file of files) {
        const form = new FormData();
        form.append("file", file);
        form.append("alt", file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
        const res = await fetch("/api/admin/gallery", { method: "POST", body: form });
        if (!res.ok) { const j = await res.json(); setError(j.error ?? "Upload failed"); }
      }
      await load();
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function deleteImage(id: string) {
    if (!confirm("Delete this photo?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    setImages(prev => prev.filter(i => i.id !== id));
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-black text-xl text-white uppercase tracking-tight">Gallery</h1>
          <p className="text-ink-500 text-xs mt-0.5">{images.length} photos</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-saffron-600 hover:bg-saffron-500 disabled:opacity-60 text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-colors flex items-center gap-2"
        >
          {uploading ? (
            <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Uploading…</>
          ) : "📤 Upload"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </div>

      {error && <p className="text-red-400 text-sm mb-4 bg-red-950/40 border border-red-800 rounded-lg px-3 py-2">{error}</p>}

      {/* Upload drop zone */}
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full border-2 border-dashed border-ink-700 hover:border-saffron-600 rounded-xl py-8 mb-5 text-center transition-colors group"
      >
        <p className="text-3xl mb-2">📷</p>
        <p className="text-ink-400 text-sm group-hover:text-saffron-400 transition-colors">Tap to upload photos from your camera roll</p>
        <p className="text-ink-600 text-xs mt-1">JPG, PNG, WEBP — multiple files supported</p>
      </button>

      {loading ? (
        <div className="text-center py-12 text-ink-500">Loading…</div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-ink-600">No photos yet. Upload your first one above.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map(img => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden bg-ink-900 border border-ink-700 aspect-square">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width:640px) 50vw, 33vw"
                unoptimized={img.url.includes("supabase")}
              />
              <div className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/50 transition-colors flex items-center justify-center">
                <button
                  onClick={() => deleteImage(img.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
