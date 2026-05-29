"use client";

import { useState, useEffect } from "react";

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  notes: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-yellow-900/40 text-yellow-300 border border-yellow-700/50",
  confirmed: "bg-green-900/40 text-green-300 border border-green-700/50",
  cancelled: "bg-red-900/40 text-red-300 border border-red-700/50",
  completed: "bg-ink-800 text-ink-400 border border-ink-600",
};

const STATUSES = ["pending", "confirmed", "cancelled", "completed"] as const;

function isUpcoming(date: string) {
  return new Date(date) >= new Date(new Date().toDateString());
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"upcoming" | "all">("upcoming");
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res  = await fetch("/api/admin/reservations");
    const json = await res.json();
    setReservations(json.reservations ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    await fetch("/api/admin/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setReservations(prev =>
      prev.map(r => r.id === id ? { ...r, status: status as Reservation["status"] } : r)
    );
    setUpdating(null);
  }

  const displayed = filter === "upcoming"
    ? reservations.filter(r => isUpcoming(r.date) && r.status !== "cancelled")
    : reservations;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-black text-xl text-white uppercase tracking-tight">Reservations</h1>
          <p className="text-ink-500 text-xs mt-0.5">{reservations.length} total · {reservations.filter(r => r.status === "pending").length} pending</p>
        </div>
        <button onClick={load} className="text-ink-500 hover:text-white text-xs transition-colors">↻ Refresh</button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {(["upcoming", "all"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase transition-colors ${
              filter === f ? "bg-saffron-600 text-white" : "bg-ink-800 text-ink-400 border border-ink-600 hover:text-white"
            }`}>
            {f === "upcoming" ? "Upcoming" : "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-ink-500">Loading…</div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-ink-600">
          {filter === "upcoming" ? "No upcoming reservations." : "No reservations yet."}
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(r => (
            <div key={r.id} className="bg-ink-900 border border-ink-700 rounded-xl p-4">
              {/* Row 1: name, date/time, guests */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-white font-semibold text-sm">{r.name}</p>
                  <p className="text-saffron-400 text-xs mt-0.5 font-medium">
                    {r.date} &nbsp;·&nbsp; {r.time} &nbsp;·&nbsp; {r.guests} guest{Number(r.guests) !== 1 ? "s" : ""}
                  </p>
                </div>
                <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[r.status]}`}>
                  {r.status}
                </span>
              </div>

              {/* Row 2: contact */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-400 mb-3">
                <a href={`mailto:${r.email}`} className="hover:text-saffron-400 transition-colors">{r.email}</a>
                <a href={`tel:${r.phone}`} className="hover:text-saffron-400 transition-colors">{r.phone}</a>
              </div>

              {/* Notes */}
              {r.notes && (
                <p className="text-ink-500 text-xs bg-ink-800 rounded-lg px-3 py-2 mb-3 leading-relaxed">
                  {r.notes}
                </p>
              )}

              {/* Status actions */}
              <div className="flex gap-2 flex-wrap">
                {STATUSES.filter(s => s !== r.status).map(s => (
                  <button key={s} onClick={() => updateStatus(r.id, s)}
                    disabled={updating === r.id}
                    className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-lg bg-ink-800 border border-ink-600 text-ink-400 hover:text-white hover:border-saffron-500 transition-colors disabled:opacity-50">
                    {updating === r.id ? "…" : `Mark ${s}`}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
