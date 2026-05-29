"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MENU } from "@/lib/data";

interface CartItem {
  id:       string;
  name:     string;
  price:    number;
  quantity: number;
}

type PageStatus = "browsing" | "submitting" | "success" | "error";

const CATEGORIES = Object.keys(MENU) as Array<keyof typeof MENU>;
const TAX_RATE   = 0.05;

export default function OrderingClient({ tableId }: { tableId: string }) {
  const [activeTab,    setActiveTab]    = useState<string>(CATEGORIES[0]);
  const [cart,         setCart]         = useState<CartItem[]>([]);
  const [showCart,     setShowCart]     = useState(false);
  const [status,       setStatus]       = useState<PageStatus>("browsing");
  const [orderId,      setOrderId]      = useState("");
  const [customerName, setCustomerName] = useState("");
  const [notes,        setNotes]        = useState("");
  const [errorMsg,     setErrorMsg]     = useState("");

  // Restore cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`hentak-cart-${tableId}`);
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, [tableId]);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`hentak-cart-${tableId}`, JSON.stringify(cart));
    } catch {}
  }, [cart, tableId]);

  /* ── Cart helpers ─────────────────────────────── */
  function addItem(item: { id: string; name: string; price: number }) {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === item.id);
      return ex
        ? prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }];
    });
  }

  function decItem(id: string) {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === id);
      if (!ex) return prev;
      return ex.quantity === 1
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  }

  function removeItem(id: string) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  function qty(id: string) { return cart.find((i) => i.id === id)?.quantity ?? 0; }

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal  = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax       = Math.round(subtotal * TAX_RATE);
  const total     = subtotal + tax;

  /* ── Place order ──────────────────────────────── */
  async function placeOrder() {
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res  = await fetch("/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ tableId, items: cart, customerName, notes, subtotal, tax, total }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to place order");
      setOrderId(json.orderId);
      setStatus("success");
      setShowCart(false);
      setCart([]);
      setCustomerName("");
      setNotes("");
      localStorage.removeItem(`hentak-cart-${tableId}`);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
      setStatus("error");
    }
  }

  /* ── Success screen ───────────────────────────── */
  if (status === "success") {
    return (
      <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-forest-900 border-2 border-forest-500 flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-forest-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-saffron-400 text-[10px] font-bold tracking-[0.4em] uppercase mb-2">Table {tableId}</p>
        <h1 className="text-white font-black text-4xl uppercase tracking-tight mb-2">Order Placed!</h1>
        <p className="text-ink-400 text-sm mb-8">Your food is on its way. Sit back and enjoy.</p>

        <div className="w-full max-w-xs bg-ink-900 border border-ink-700 rounded-2xl p-6 mb-8">
          <p className="text-ink-500 text-xs uppercase tracking-widest mb-1">Order Number</p>
          <p className="text-saffron-400 font-black text-3xl tracking-widest">{orderId}</p>
          <div className="mt-4 pt-4 border-t border-ink-800 text-left space-y-1">
            <p className="text-ink-400 text-xs uppercase tracking-widest mb-2">Summary</p>
            {cart.length > 0
              ? cart.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span className="text-ink-300">{i.name} × {i.quantity}</span>
                    <span className="text-ink-400">₹{i.price * i.quantity}</span>
                  </div>
                ))
              : <p className="text-ink-400 text-xs">Order submitted successfully</p>
            }
          </div>
        </div>

        <button
          onClick={() => { setStatus("browsing"); }}
          className="w-full max-w-xs py-4 bg-saffron-600 hover:bg-saffron-500 text-white font-black tracking-widest uppercase rounded-xl transition-colors"
        >
          Order More
        </button>
      </div>
    );
  }

  /* ── Main ordering UI ─────────────────────────── */
  return (
    <div className="min-h-screen bg-ink-950 flex flex-col max-w-lg mx-auto">

      {/* ── Top bar ───────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-ink-950/95 backdrop-blur-sm border-b border-ink-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
            <Image src="/hentak-logo.jpg" alt="Hentak" width={40} height={40} className="object-contain" priority />
          </div>
          <div className="leading-none">
            <p className="text-white font-black text-sm tracking-widest uppercase">HENTAK.</p>
            <p className="text-saffron-400 text-[9px] font-bold tracking-[0.25em] uppercase mt-0.5">
              Table {tableId}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCart(true)}
          className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold tracking-wide transition-colors ${
            cartCount > 0
              ? "bg-saffron-600 hover:bg-saffron-500 text-white"
              : "bg-ink-800 hover:bg-ink-700 text-ink-300 border border-ink-600"
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          {cartCount > 0 ? (
            <span>{cartCount} item{cartCount !== 1 ? "s" : ""} · ₹{total}</span>
          ) : (
            <span>Cart</span>
          )}
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-saffron-700 text-[10px] font-black rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Category tabs ─────────────────────────── */}
      <div className="sticky top-[61px] z-30 bg-ink-900 border-b border-ink-800 overflow-x-auto scrollbar-none">
        <div className="flex min-w-max">
          {CATEGORIES.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3.5 text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-saffron-500 text-saffron-400"
                  : "border-transparent text-ink-500 hover:text-ink-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Menu items ────────────────────────────── */}
      <div className="flex-1 px-4 py-4 space-y-3 pb-24">
        {MENU[activeTab as keyof typeof MENU].map((item) => {
          const q = qty(item.id);
          return (
            <div
              key={item.id}
              className={`bg-ink-900 border rounded-xl p-4 transition-colors ${
                q > 0 ? "border-saffron-600/50" : "border-ink-700"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-white font-bold text-sm leading-snug">{item.name}</h3>
                      {item.meitei && (
                        <p className="text-ink-600 text-[10px] mt-0.5">{item.meitei}</p>
                      )}
                    </div>
                    <span className="text-saffron-400 font-black text-sm whitespace-nowrap">₹{item.price}</span>
                  </div>
                  <p className="text-ink-400 text-xs leading-relaxed mt-1.5">{item.description}</p>
                  {item.tag && (
                    <span className="inline-block mt-2 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-saffron-900/50 text-saffron-400 border border-saffron-800">
                      {item.tag}
                    </span>
                  )}
                </div>

                {/* Add / qty control */}
                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  {q === 0 ? (
                    <button
                      onClick={() => addItem({ id: item.id, name: item.name, price: item.price })}
                      className="w-9 h-9 rounded-full bg-saffron-600 hover:bg-saffron-500 text-white flex items-center justify-center transition-colors shadow-md"
                      aria-label={`Add ${item.name}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-ink-800 rounded-full px-1 py-1 border border-ink-600">
                      <button onClick={() => decItem(item.id)} className="w-7 h-7 rounded-full bg-ink-700 hover:bg-ink-600 text-white flex items-center justify-center" aria-label="Decrease">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                      </button>
                      <span className="text-white font-black text-sm w-5 text-center tabular-nums">{q}</span>
                      <button onClick={() => addItem({ id: item.id, name: item.name, price: item.price })} className="w-7 h-7 rounded-full bg-saffron-600 hover:bg-saffron-500 text-white flex items-center justify-center" aria-label="Increase">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating cart CTA (only when cart has items and sheet is closed) */}
      {cartCount > 0 && !showCart && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-[calc(28rem-2rem)] px-4">
          <button
            onClick={() => setShowCart(true)}
            className="w-full py-4 bg-saffron-600 hover:bg-saffron-500 text-white rounded-2xl font-black tracking-widest uppercase text-sm shadow-2xl shadow-saffron-900/50 flex items-center justify-between px-5 transition-colors"
          >
            <span className="w-6 h-6 bg-saffron-500 rounded-full flex items-center justify-center text-xs font-black">{cartCount}</span>
            <span>View Order</span>
            <span className="font-black">₹{total}</span>
          </button>
        </div>
      )}

      {/* ── Cart bottom sheet ──────────────────────── */}
      {showCart && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink-950/75 backdrop-blur-sm z-50"
            onClick={() => setShowCart(false)}
          />

          {/* Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-ink-900 rounded-t-2xl border-t border-ink-700 shadow-2xl max-h-[90vh] flex flex-col max-w-lg mx-auto">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-ink-600" />
            </div>

            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-ink-800 shrink-0">
              <div>
                <h2 className="text-white font-black text-lg uppercase tracking-tight">Your Order</h2>
                <p className="text-saffron-500 text-[9px] font-bold tracking-widest uppercase">Table {tableId}</p>
              </div>
              <button onClick={() => setShowCart(false)} className="w-8 h-8 rounded-full bg-ink-800 hover:bg-ink-700 text-ink-400 hover:text-white flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-ink-500 text-sm">Your cart is empty</p>
                  <button onClick={() => setShowCart(false)} className="mt-4 text-saffron-500 text-xs font-bold tracking-widest uppercase">Browse Menu</button>
                </div>
              ) : (
                <>
                  {/* Cart items */}
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-ink-800 rounded-xl px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                        <p className="text-ink-500 text-xs">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => decItem(item.id)} className="w-7 h-7 rounded-full bg-ink-700 hover:bg-ink-600 text-white flex items-center justify-center">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                        </button>
                        <span className="text-white font-black text-sm w-5 text-center tabular-nums">{item.quantity}</span>
                        <button onClick={() => addItem({ id: item.id, name: item.name, price: item.price })} className="w-7 h-7 rounded-full bg-saffron-600 hover:bg-saffron-500 text-white flex items-center justify-center">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        </button>
                        <span className="text-saffron-400 font-bold text-sm w-12 text-right tabular-nums">₹{item.price * item.quantity}</span>
                        <button onClick={() => removeItem(item.id)} className="ml-1 text-ink-600 hover:text-red-400 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Price breakdown */}
                  <div className="bg-ink-950 rounded-xl px-4 py-4 space-y-2 border border-ink-800">
                    <div className="flex justify-between text-sm text-ink-400">
                      <span>Subtotal</span><span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-ink-400">
                      <span>GST (5%)</span><span>₹{tax}</span>
                    </div>
                    <div className="flex justify-between text-base font-black border-t border-ink-700 pt-2 mt-1">
                      <span className="text-white">Total</span>
                      <span className="text-saffron-400">₹{total}</span>
                    </div>
                  </div>

                  {/* Name + notes */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-ink-500 mb-1.5">
                        Your Name <span className="text-ink-700">(optional)</span>
                      </label>
                      <input
                        type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="So we know who to bring it to"
                        className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-ink-600 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-ink-500 mb-1.5">Special Instructions</label>
                      <textarea
                        value={notes} onChange={(e) => setNotes(e.target.value)}
                        placeholder="Allergies, spice level, extra notes…"
                        rows={2}
                        className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-ink-600 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>

                  {status === "error" && (
                    <div className="bg-red-950/60 border border-red-800 rounded-lg px-4 py-3 text-red-300 text-sm">{errorMsg}</div>
                  )}
                </>
              )}
            </div>

            {/* Place order button */}
            {cart.length > 0 && (
              <div className="px-5 py-4 border-t border-ink-800 shrink-0">
                <button
                  onClick={placeOrder}
                  disabled={status === "submitting"}
                  className="w-full py-4 bg-saffron-600 hover:bg-saffron-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black tracking-widest uppercase text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  {status === "submitting" ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Placing Order…
                    </>
                  ) : (
                    `Place Order · ₹${total}`
                  )}
                </button>
                <p className="text-center text-ink-600 text-xs mt-2">
                  Your order goes directly to the kitchen
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
