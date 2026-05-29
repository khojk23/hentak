"use client";

import { useState, useEffect, useCallback } from "react";
import type { Order, OrderStatus } from "@/lib/orderStore";

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  pending:   "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready:     "served",
  served:    null,
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending:   "New",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready:     "Ready",
  served:    "Served",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending:   "bg-yellow-500/20 text-yellow-300 border-yellow-700",
  confirmed: "bg-blue-500/20 text-blue-300 border-blue-700",
  preparing: "bg-orange-500/20 text-orange-300 border-orange-700",
  ready:     "bg-green-500/20 text-green-300 border-green-700",
  served:    "bg-ink-700/50 text-ink-400 border-ink-600",
};

const BTN_COLOR: Record<string, string> = {
  "Confirm":    "bg-blue-600 hover:bg-blue-500",
  "Prepare":    "bg-orange-600 hover:bg-orange-500",
  "Mark Ready": "bg-green-600 hover:bg-green-500",
  "Served":     "bg-ink-600 hover:bg-ink-500",
};

function nextActionLabel(status: OrderStatus): string | null {
  const next = STATUS_FLOW[status];
  if (!next) return null;
  const map: Record<OrderStatus, string> = {
    confirmed: "Confirm", preparing: "Prepare", ready: "Mark Ready", served: "Served", pending: "",
  };
  return map[next] ?? null;
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day:    "2-digit",
    month:  "short",
    hour:   "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const ACTIVE_STATUSES: OrderStatus[] = ["pending", "confirmed", "preparing", "ready"];

export default function AdminOrdersPage() {
  const [orders,      setOrders]      = useState<Order[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [updating,    setUpdating]    = useState<string | null>(null);
  const [filter,      setFilter]      = useState<OrderStatus | "all">("all");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [showLog,     setShowLog]     = useState(true);

  const fetchOrders = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res  = await fetch("/api/orders", { cache: "no-store" });
      const json = await res.json();
      setOrders(json.orders ?? []);
      setLastRefresh(new Date());
    } catch {
      // silent — keep showing last known state
    } finally {
      setLoading(false);
      if (manual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => fetchOrders(), 8000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  async function advanceStatus(order: Order) {
    const next = STATUS_FLOW[order.status];
    if (!next) return;
    setUpdating(order.id);
    try {
      await fetch(`/api/orders/${order.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: next }),
      });
      await fetchOrders();
    } finally {
      setUpdating(null);
    }
  }

  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
  const servedOrders = orders.filter((o) => o.status === "served")
    .sort((a, b) => new Date(b.servedAt ?? b.createdAt).getTime() - new Date(a.servedAt ?? a.createdAt).getTime());

  const filtered = filter === "all"
    ? activeOrders
    : activeOrders.filter((o) => o.status === filter);

  const pending   = orders.filter((o) => o.status === "pending").length;
  const preparing = orders.filter((o) => o.status === "preparing" || o.status === "confirmed").length;
  const ready     = orders.filter((o) => o.status === "ready").length;

  return (
    <div className="min-h-screen bg-ink-950 text-white">

      {/* ── Header ───────────────────────────────── */}
      <div className="bg-[#0a0806] border-b border-ink-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
        <div>
          <h1 className="font-black text-xl uppercase tracking-widest text-white">HENTAK.</h1>
          <p className="text-saffron-500 text-[9px] font-bold tracking-[0.3em] uppercase">Kitchen Dashboard</p>
        </div>

        <div className="flex items-center gap-5">
          {[
            { label: "New",    count: pending,   color: "text-yellow-400" },
            { label: "Active", count: preparing, color: "text-orange-400" },
            { label: "Ready",  count: ready,     color: "text-green-400"  },
            { label: "Served", count: servedOrders.length, color: "text-ink-400" },
          ].map(({ label, count, color }) => (
            <div key={label} className="text-center">
              <p className={`font-black text-2xl ${color} tabular-nums`}>{count}</p>
              <p className="text-ink-500 text-[9px] font-bold tracking-widest uppercase">{label}</p>
            </div>
          ))}

          {/* Refresh button — spins while fetching */}
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            title="Refresh orders"
            className="p-2.5 rounded-lg bg-ink-800 hover:bg-ink-700 disabled:opacity-60 text-ink-400 hover:text-white transition-colors"
          >
            <svg
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Auto-refresh status */}
      <div className="px-6 py-2 flex items-center gap-2 bg-ink-900 border-b border-ink-800">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-ink-600 text-xs">
          Auto-refreshes every 8s · Last updated: {lastRefresh.toLocaleTimeString()}
        </span>
      </div>

      {/* ── Filter tabs (active statuses only) ───── */}
      <div className="bg-ink-900 border-b border-ink-800 px-6 overflow-x-auto">
        <div className="flex min-w-max">
          {(["all", "pending", "confirmed", "preparing", "ready"] as const).map((f) => {
            const count = f === "all"
              ? activeOrders.length
              : activeOrders.filter((o) => o.status === f).length;
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-5 py-3 text-xs font-bold tracking-widest uppercase border-b-2 transition-colors whitespace-nowrap ${
                  filter === f ? "border-saffron-500 text-saffron-400" : "border-transparent text-ink-500 hover:text-ink-200"
                }`}
              >
                {f === "all" ? `Active (${count})` : `${STATUS_LABEL[f]} (${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Orders ─────────────────────────── */}
      <div className="px-4 sm:px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="w-8 h-8 animate-spin text-saffron-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-ink-600 text-4xl mb-3">🍽</p>
            <p className="text-ink-500 text-sm">No active orders{filter !== "all" ? ` with status "${filter}"` : ""}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((order) => {
              const action = nextActionLabel(order.status);
              return (
                <div key={order.id}
                  className={`bg-ink-900 rounded-xl border p-5 flex flex-col gap-4 ${
                    order.status === "pending" ? "border-yellow-700/50" :
                    order.status === "ready"   ? "border-green-700/50"  : "border-ink-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white font-black text-lg">Table {order.tableId}</span>
                        {order.customerName && <span className="text-ink-500 text-xs">— {order.customerName}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-ink-500 text-xs font-mono">{order.id}</span>
                        <span className="text-ink-600 text-xs">· {timeAgo(order.createdAt)}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border ${STATUS_COLOR[order.status]}`}>
                      {STATUS_LABEL[order.status]}
                    </span>
                  </div>

                  <div className="bg-ink-950 rounded-lg px-3 py-3 space-y-1.5 border border-ink-800">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-ink-200">
                          <span className="text-saffron-500 font-bold mr-1.5">×{item.quantity}</span>{item.name}
                        </span>
                        <span className="text-ink-500 tabular-nums">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    {order.notes && (
                      <p className="text-ink-500 text-xs pt-1.5 border-t border-ink-800 italic">Note: {order.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-ink-500 text-xs">Total</p>
                      <p className="text-saffron-400 font-black text-lg tabular-nums">₹{order.total}</p>
                    </div>
                    {action && (
                      <button
                        onClick={() => advanceStatus(order)}
                        disabled={updating === order.id}
                        className={`px-5 py-2.5 rounded-lg text-white text-xs font-bold tracking-widest uppercase transition-colors disabled:opacity-50 ${BTN_COLOR[action] ?? "bg-saffron-600 hover:bg-saffron-500"}`}
                      >
                        {updating === order.id ? "…" : action}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Served Log ───────────────────────────── */}
      {servedOrders.length > 0 && (
        <div className="px-4 sm:px-6 pb-8">
          <div className="border-t border-ink-800 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="font-black text-sm text-ink-400 uppercase tracking-widest">
                  Served Log
                </h2>
                <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-ink-800 text-ink-500 border border-ink-700">
                  {servedOrders.length} orders
                </span>
              </div>
              <button
                onClick={() => setShowLog((v) => !v)}
                className="text-ink-600 hover:text-ink-300 text-xs transition-colors"
              >
                {showLog ? "Hide ↑" : "Show ↓"}
              </button>
            </div>

            {showLog && (
              <div className="bg-ink-900 rounded-xl border border-ink-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink-800">
                      <th className="text-left px-4 py-2.5 text-[9px] font-bold tracking-widest uppercase text-ink-600">Order</th>
                      <th className="text-left px-4 py-2.5 text-[9px] font-bold tracking-widest uppercase text-ink-600">Table</th>
                      <th className="text-left px-4 py-2.5 text-[9px] font-bold tracking-widest uppercase text-ink-600 hidden sm:table-cell">Items</th>
                      <th className="text-right px-4 py-2.5 text-[9px] font-bold tracking-widest uppercase text-ink-600">Total</th>
                      <th className="text-right px-4 py-2.5 text-[9px] font-bold tracking-widest uppercase text-ink-600">Served At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-800">
                    {servedOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-ink-800/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-ink-500">{order.id}</td>
                        <td className="px-4 py-3 text-ink-300 font-semibold">
                          T{order.tableId}
                          {order.customerName && <span className="text-ink-600 font-normal ml-1 hidden sm:inline">· {order.customerName}</span>}
                        </td>
                        <td className="px-4 py-3 text-ink-500 hidden sm:table-cell text-xs">
                          {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                        </td>
                        <td className="px-4 py-3 text-right text-saffron-500 font-bold tabular-nums">₹{order.total}</td>
                        <td className="px-4 py-3 text-right text-ink-500 text-xs whitespace-nowrap">
                          {formatDateTime(order.servedAt ?? order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-ink-700 bg-ink-950/50">
                      <td colSpan={3} className="px-4 py-2.5 text-[9px] font-bold tracking-widest uppercase text-ink-600 hidden sm:table-cell">
                        {servedOrders.length} orders served
                      </td>
                      <td colSpan={2} className="px-4 py-2.5 text-right text-ink-400 font-black text-sm tabular-nums">
                        ₹{servedOrders.reduce((s, o) => s + o.total, 0)} total
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 border-t border-ink-900 flex gap-4 text-xs text-ink-600">
        <a href="/admin/qr-codes" className="hover:text-saffron-400 transition-colors">QR Codes →</a>
        <a href="/" className="hover:text-ink-400 transition-colors">Back to Site</a>
      </div>
    </div>
  );
}
