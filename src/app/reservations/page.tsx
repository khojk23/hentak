"use client";

import { useState, FormEvent } from "react";
import { RESTAURANT } from "@/lib/data";

const TIME_SLOTS = [
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "18:30","19:00","19:30","20:00","20:30","21:00","21:30",
];

type Status = "idle" | "submitting" | "success" | "error";
interface FormData { name:string; email:string; phone:string; date:string; time:string; guests:string; notes:string; }
const EMPTY: FormData = { name:"", email:"", phone:"", date:"", time:"", guests:"2", notes:"" };

export default function ReservationsPage() {
  const [status, setStatus]     = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm]         = useState<FormData>(EMPTY);
  const today = new Date().toISOString().split("T")[0];

  function handleChange(e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting"); setErrorMsg("");
    try {
      const res  = await fetch("/api/reservations", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) { setErrorMsg(json.error || "Something went wrong."); setStatus("error"); return; }
      setStatus("success");
    } catch { setErrorMsg("Network error — please try again."); setStatus("error"); }
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-ink-950 pt-[108px] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-ink-900 rounded-2xl shadow-2xl p-10 border border-ink-700">
          <div className="w-16 h-16 bg-forest-900 border border-forest-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-forest-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-black text-3xl text-foreground uppercase tracking-tight mb-3">Table Reserved!</h2>
          <p className="text-ink-300 text-sm leading-relaxed mb-2">
            Thank you, <strong className="text-white">{form.name}</strong>. Your table for{" "}
            <strong className="text-white">{form.guests} {Number(form.guests)===1?"guest":"guests"}</strong> on{" "}
            <strong className="text-white">{form.date}</strong> at <strong className="text-white">{form.time}</strong> is confirmed.
          </p>
          <p className="text-ink-500 text-xs mb-8">Confirmation sent to <strong className="text-ink-300">{form.email}</strong>.</p>
          <div className="space-y-3">
            <button onClick={() => { setStatus("idle"); setForm(EMPTY); }}
              className="w-full py-3 bg-saffron-600 hover:bg-saffron-500 text-white rounded font-bold text-xs tracking-widest uppercase transition-colors">
              Make Another Reservation
            </button>
            <a href={RESTAURANT.instagram} target="_blank" rel="noopener noreferrer"
              className="block w-full py-3 border border-ink-600 hover:border-saffron-500 text-ink-400 hover:text-saffron-400 rounded font-bold text-xs tracking-widest uppercase transition-colors">
              Follow us on Instagram
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950 pt-[108px]">
      {/* Header */}
      <div className="bg-[#0a0806] py-16 text-center px-4 border-b border-ink-800">
        <p className="text-saffron-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-3">Join Us</p>
        <h1 className="font-black text-5xl sm:text-6xl text-foreground uppercase tracking-tight mb-3">Reservations</h1>
        <div className="w-10 h-0.5 bg-saffron-500 mx-auto mb-4" />
        <p className="text-ink-400 max-w-md mx-auto text-sm">Book your table at Hentak. For parties of 9 or more, please call us.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} noValidate className="bg-ink-900 rounded-2xl border border-ink-700 p-8">
              <h2 className="font-black text-2xl text-foreground uppercase tracking-tight mb-7">Your Details</h2>

              {status === "error" && (
                <div className="mb-6 flex items-start gap-3 bg-red-950/60 border border-red-800 rounded-lg px-4 py-3">
                  <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <p className="text-red-300 text-sm">{errorMsg}</p>
                </div>
              )}

              <Field label="Full Name" required>
                <input id="name" name="name" type="text" required placeholder="Your full name"
                  value={form.name} onChange={handleChange} className={inp()} />
              </Field>

              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <Field label="Email" required nomb>
                  <input id="email" name="email" type="email" required placeholder="your@email.com"
                    value={form.email} onChange={handleChange} className={inp()} />
                </Field>
                <Field label="Phone" required nomb>
                  <input id="phone" name="phone" type="tel" required placeholder="+91 98621 XXXXX"
                    value={form.phone} onChange={handleChange} className={inp()} />
                </Field>
              </div>

              <div className="grid sm:grid-cols-3 gap-5 mb-5">
                <Field label="Date" required nomb>
                  <input id="date" name="date" type="date" required min={today}
                    value={form.date} onChange={handleChange} className={inp()} />
                </Field>
                <Field label="Time" required nomb>
                  <select id="time" name="time" required value={form.time} onChange={handleChange} className={inp()}>
                    <option value="">Select</option>
                    <optgroup label="Lunch">
                      {TIME_SLOTS.filter(t => t < "15:00").map(t => <option key={t} value={t}>{t}</option>)}
                    </optgroup>
                    <optgroup label="Dinner">
                      {TIME_SLOTS.filter(t => t >= "18:00").map(t => <option key={t} value={t}>{t}</option>)}
                    </optgroup>
                  </select>
                </Field>
                <Field label="Guests" required nomb>
                  <select id="guests" name="guests" required value={form.guests} onChange={handleChange} className={inp()}>
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n===1?"guest":"guests"}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Special Requests">
                <textarea id="notes" name="notes" rows={3}
                  placeholder="Dietary requirements, celebrations, seating preferences…"
                  value={form.notes} onChange={handleChange} className={`${inp()} resize-none`} />
              </Field>

              <button type="submit" disabled={status==="submitting"}
                className="w-full py-4 bg-saffron-600 hover:bg-saffron-500 disabled:opacity-60 disabled:cursor-not-allowed text-foreground font-bold tracking-[0.2em] uppercase text-xs rounded-lg transition-colors flex items-center justify-center gap-2">
                {status === "submitting" ? (
                  <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Confirming…</>
                ) : "Confirm Reservation"}
              </button>
              <p className="text-center text-ink-600 text-xs mt-4">No payment required. Tables held 15 minutes.</p>
            </form>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-2 space-y-5">
            <div className="bg-[#0a0806] rounded-2xl p-7 border border-ink-800">
              <h3 className="font-black text-lg text-foreground uppercase tracking-tight mb-5">Contact</h3>
              <div className="space-y-4">
                {[
                  { icon: "📞", label:"Phone", value: RESTAURANT.phone, href: `tel:${RESTAURANT.phone}` },
                  { icon: "✉️", label:"Email", value: RESTAURANT.email, href: `mailto:${RESTAURANT.email}` },
                  { icon: "📍", label:"Address", value: RESTAURANT.address, href: null },
                ].map(({ label, value, href }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <p className="text-[9px] font-bold tracking-widest uppercase text-ink-600">{label}</p>
                    {href
                      ? <a href={href} className="text-sm text-ink-300 hover:text-saffron-400 transition-colors">{value}</a>
                      : <p className="text-sm text-ink-300 leading-relaxed">{value}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ink-900 rounded-2xl p-7 border border-saffron-800/50">
              <h3 className="font-black text-lg text-foreground uppercase tracking-tight mb-4">Good to Know</h3>
              <ul className="space-y-3">
                {[
                  "Tables held for 15 minutes past booking time",
                  "For groups of 9+, please call ahead",
                  "Private dining available for special occasions",
                  "Seasonal menu — dishes may vary daily",
                  "Vegetarian & vegan options always available",
                ].map(note => (
                  <li key={note} className="flex gap-2.5 text-sm text-ink-300">
                    <span className="text-saffron-500 mt-0.5 shrink-0 font-bold">✦</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function inp() {
  return "w-full bg-ink-800 border border-ink-600 rounded-lg px-4 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition";
}

function Field({ label, required, nomb, children }: { label:string; required?:boolean; nomb?:boolean; children:React.ReactNode }) {
  const id = label.toLowerCase().replace(/\s+/g,"-");
  return (
    <div className={nomb ? "" : "mb-5"}>
      <label htmlFor={id} className="block text-[10px] font-bold tracking-widest uppercase text-ink-400 mb-1.5">
        {label} {required && <span className="text-saffron-500">*</span>}
      </label>
      {children}
    </div>
  );
}
