"use client";

import { useState, FormEvent } from "react";
import { RESTAURANT } from "@/lib/data";

type Status = "idle" | "submitting" | "success";

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm]     = useState({ name:"", email:"", subject:"", message:"" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
  }

  const inputCls = "w-full bg-ink-800 border border-ink-600 rounded-lg px-4 py-3 text-sm text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition";

  return (
    <div className="min-h-screen bg-ink-950 pt-[108px]">
      {/* Header */}
      <div className="bg-[#0a0806] py-16 text-center px-4 border-b border-ink-800">
        <p className="text-saffron-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-3">Get In Touch</p>
        <h1 className="font-black text-5xl sm:text-6xl text-foreground uppercase tracking-tight mb-3">Contact</h1>
        <div className="w-10 h-0.5 bg-saffron-500 mx-auto mb-4" />
        <p className="text-ink-400 max-w-xl mx-auto text-sm leading-relaxed">
          Reservations, private dining, press, or just a hello — we&apos;d love to hear from you.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* Info + Map */}
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label:"Phone", value: RESTAURANT.phone, href:`tel:${RESTAURANT.phone}` },
                { label:"Email", value: RESTAURANT.email, href:`mailto:${RESTAURANT.email}` },
              ].map(({ label, value, href }) => (
                <a key={label} href={href}
                  className="flex flex-col bg-ink-900 rounded-xl p-5 border border-ink-700 hover:border-saffron-500 transition group">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-ink-500 mb-2">{label}</span>
                  <span className="text-ink-200 text-sm group-hover:text-saffron-400 transition-colors">{value}</span>
                </a>
              ))}
            </div>

            <div className="bg-ink-900 rounded-xl p-6 border border-ink-700">
              <p className="text-[9px] font-bold tracking-widest uppercase text-ink-500 mb-2">Address</p>
              <p className="text-ink-200 text-sm leading-relaxed">{RESTAURANT.address}</p>
              <a href={RESTAURANT.instagram} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-xs text-saffron-500 hover:text-saffron-400 font-semibold tracking-wide">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                @hentak_restaurant
              </a>
            </div>

            <div className="rounded-xl overflow-hidden border border-ink-700 shadow-lg">
              <iframe src={RESTAURANT.mapsEmbed} width="100%" height="300" style={{border:0}} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="Hentak Restaurant — Imphal, Manipur" className="block" />
            </div>
          </div>

          {/* Form */}
          <div className="bg-ink-900 rounded-2xl border border-ink-700 p-8">
            <h2 className="font-black text-2xl text-foreground uppercase tracking-tight mb-6">Send a Message</h2>

            {status === "success" ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 bg-forest-900 border border-forest-600 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-forest-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-black text-2xl text-white uppercase mb-2">Message Sent</h3>
                <p className="text-ink-400 text-sm mb-6">We&apos;ll reply to <span className="text-ink-200">{form.email}</span> within 24 hours.</p>
                <button onClick={() => { setStatus("idle"); setForm({ name:"", email:"", subject:"", message:"" }); }}
                  className="px-5 py-2.5 bg-saffron-600 hover:bg-saffron-500 text-white rounded font-bold text-xs tracking-widest uppercase transition-colors">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="cname" className="block text-[10px] font-bold tracking-widest uppercase text-ink-400 mb-1.5">Name *</label>
                    <input id="cname" name="name" type="text" required placeholder="Your name"
                      value={form.name} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="cemail" className="block text-[10px] font-bold tracking-widest uppercase text-ink-400 mb-1.5">Email *</label>
                    <input id="cemail" name="email" type="email" required placeholder="your@email.com"
                      value={form.email} onChange={handleChange} className={inputCls} />
                  </div>
                </div>

                <div>
                  <label htmlFor="csubject" className="block text-[10px] font-bold tracking-widest uppercase text-ink-400 mb-1.5">Subject *</label>
                  <select id="csubject" name="subject" required value={form.subject} onChange={handleChange} className={inputCls}>
                    <option value="">Select a topic</option>
                    <option value="reservation">Reservation Enquiry</option>
                    <option value="private">Private Dining</option>
                    <option value="events">Events & Celebrations</option>
                    <option value="press">Press & Media</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="cmessage" className="block text-[10px] font-bold tracking-widest uppercase text-ink-400 mb-1.5">Message *</label>
                  <textarea id="cmessage" name="message" rows={5} required placeholder="How can we help?"
                    value={form.message} onChange={handleChange} className={`${inputCls} resize-none`} />
                </div>

                <button type="submit" disabled={status==="submitting"}
                  className="w-full py-4 bg-saffron-600 hover:bg-saffron-500 disabled:opacity-60 text-foreground font-bold tracking-[0.2em] uppercase text-xs rounded-lg transition-colors">
                  {status==="submitting" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
