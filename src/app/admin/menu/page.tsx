"use client";

import { useState, useEffect, FormEvent } from "react";
import type { MenuItem } from "@/lib/supabase";

const CATEGORIES = ["Starters", "Mains", "Desserts", "Drinks"];
const TAGS       = ["", "Signature", "Chef's Pick", "Vegetarian", "Must Try", "New", "Non-Alcoholic"];

const EMPTY = { category: "Starters", name: "", meitei: "", description: "", price: 0, tag: "", available: true };

export default function AdminMenuPage() {
  const [items,    setItems]    = useState<MenuItem[]>([]);
  const [active,   setActive]   = useState("Starters");
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState<MenuItem | null>(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);

  async function load() {
    setLoading(true);
    const res  = await fetch("/api/admin/menu");
    const json = await res.json();
    setItems(json.items ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setEditing(null); setForm(EMPTY); setShowForm(true); }
  function openEdit(item: MenuItem) {
    setEditing(item);
    setForm({ category: item.category, name: item.name, meitei: item.meitei ?? "", description: item.description, price: item.price, tag: item.tag ?? "", available: item.available });
    setShowForm(true);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const url    = editing ? `/api/admin/menu/${editing.id}` : "/api/admin/menu";
    const method = editing ? "PATCH" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    await load();
    setShowForm(false);
    setSaving(false);
  }

  async function toggleAvailable(item: MenuItem) {
    await fetch(`/api/admin/menu/${item.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !item.available }),
    });
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, available: !i.available } : i));
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
    setItems(prev => prev.filter(i => i.id !== id));
  }

  const filtered = items.filter(i => i.category === active);
  const inp = "w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-ink-600 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent";

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-black text-xl text-white uppercase tracking-tight">Menu</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-saffron-600 hover:bg-saffron-500 text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-colors">
          + Add Item
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActive(c)}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-colors ${
              active === c ? "bg-saffron-600 text-white" : "bg-ink-800 text-ink-400 hover:text-white border border-ink-600"
            }`}
          >{c}</button>
        ))}
      </div>

      {/* Items list */}
      {loading ? (
        <div className="text-center py-12 text-ink-500">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-ink-600">No items in {active}. <button onClick={openAdd} className="text-saffron-500">Add one →</button></div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <div key={item.id} className={`bg-ink-900 border rounded-xl px-4 py-3 flex items-center gap-3 transition-colors ${item.available ? "border-ink-700" : "border-ink-800 opacity-50"}`}>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                <p className="text-ink-500 text-xs truncate">{item.description}</p>
              </div>
              <span className="text-saffron-400 font-black text-sm shrink-0">₹{item.price}</span>

              {/* Available toggle */}
              <button onClick={() => toggleAvailable(item)}
                className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${item.available ? "bg-green-600" : "bg-ink-700"}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${item.available ? "right-0.5" : "left-0.5"}`} />
              </button>

              <button onClick={() => openEdit(item)} className="text-ink-500 hover:text-saffron-400 transition-colors text-xs px-2">Edit</button>
              <button onClick={() => deleteItem(item.id)} className="text-ink-700 hover:text-red-400 transition-colors text-xs">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit form modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-ink-950/80 z-50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-ink-900 border-t border-ink-700 rounded-t-2xl p-5 max-h-[90vh] overflow-y-auto md:max-w-lg md:mx-auto md:rounded-2xl md:border md:top-1/2 md:-translate-y-1/2 md:bottom-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-black text-white text-lg uppercase">{editing ? "Edit Item" : "New Item"}</h2>
              <button onClick={() => setShowForm(false)} className="text-ink-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-ink-500 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className={inp}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-ink-500 mb-1">Tag</label>
                  <select value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))} className={inp}>
                    {TAGS.map(t => <option key={t} value={t}>{t || "None"}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-ink-500 mb-1">Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className={inp} placeholder="Dish name" />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-ink-500 mb-1">Meitei Script (optional)</label>
                <input value={form.meitei} onChange={e => setForm(p => ({ ...p, meitei: e.target.value }))} className={inp} placeholder="ꯁꯤꯡꯖꯨ" />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-ink-500 mb-1">Description *</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required rows={2} className={`${inp} resize-none`} placeholder="Ingredients, preparation…" />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-ink-500 mb-1">Price (₹) *</label>
                <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} required min={0} className={inp} />
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm(p => ({ ...p, available: !p.available }))}
                  className={`w-10 h-5 rounded-full relative transition-colors ${form.available ? "bg-green-600" : "bg-ink-700"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.available ? "right-0.5" : "left-0.5"}`} />
                </button>
                <span className="text-ink-400 text-sm">Available on menu</span>
              </div>
              <button type="submit" disabled={saving}
                className="w-full py-3.5 bg-saffron-600 hover:bg-saffron-500 disabled:opacity-60 text-white font-bold tracking-widest uppercase text-xs rounded-lg transition-colors">
                {saving ? "Saving…" : editing ? "Save Changes" : "Add Item"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
