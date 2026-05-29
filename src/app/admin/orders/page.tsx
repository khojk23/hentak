"use client";

import { useState, useEffect, useCallback } from "react";
import type { Order, OrderStatus } from "@/lib/orderStore";

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  pending:    "confirmed",
  confirmed:  "preparing",
  preparing:  "ready",
  ready:      "served",
  served:     null,
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
  "Confirm":  "bg-blue-600 hover:bg-blue-500",
  "Prepare":  "bg-orange-600 hover:bg-orange-500",
  "Mark Ready": "bg-green-600 hover:bg-green-500",
  "Served":   "bg-ink-600 hover:bg-ink-500",
};

function actionLabel(status: OrderStatus): string | null {
  const next = STATUS_FLOW[status];
  if (!next) return null;
  const map: Record<OrderStatus, string> = { confirmed: "Confirm", preparing: "Prepare", ready: "Mark Ready", served: "Served", pending: "" };
  return map[next] ?? null;
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function AdminOrdersPage() {
  const [orders,       setOrders]       = useState<Order[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [updating,     setUpdating]     = useState<string | null>(null);
  const [filter,       setFilter]       = useState<OrderStatus | "all">("all");
  const [lastRefresh,  setLastRefresh]  = useState<Date>(new Date());

  const fetchOrders = useCallback(async () => {
    try {
      const res  = await fetch("/api/orders");
      const json = await res.json();
      setOrders(json.orders ?? []);
      setLastRefresh(new Date());
    } catch {
      // silent — keep showing last known state
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + auto-refresh every 8 seconds
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
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

  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const pending   = orders.filter((o) => o.status === "pending").length;
  const preparing = orders.filter((o) => o.status === "preparing" || o.status === "confirmed").length;
  const ready     = orders.filter((o) => o.status === "ready").length;

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      {/* Header */}
      <div className="bg-[#0a0806] border-b border-ink-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="font-black text-xl uppercase tracking-widest text-white">HENTAK.</h1>
            <p className="text-saffron-500 text-[9px] font-bold tracking-[0.3em] uppercase">Kitchen Dashboard</p>
          </div>
        </div>

        {/* Live stats */}
        <div className="flex items-center gap-4">
          {[
            { label: "New",      count: pending,   color: "text-yellow-400" },
            { label: "Active",   count: preparing, color: "text-orange-400" },
            { label: "Ready",    count: ready,     color: "text-green-400"  },
          ].map(({ label, count, color }) => (
            <div key={label} className="text-center">
              <p className={`font-black text-2xl ${color} tabular-nums`}>{count}</p>
              <p className="text-ink-500 text-[9px] font-bold tracking-widest uppercase">{label}</p>
            </div>
          ))}
          <button onClick={fetchOrders} className="ml-2 p-2 rounded-lg bg-ink-800 hover:bg-ink-700 text-ink-400 hover:text-white transition-colors" title="Refresh">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-ink-900 border-b border-ink-800 px-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {(["all", "pending", "confirmed", "preparing", "ready", "served"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-3 text-xs font-bold tracking-widest uppercase border-b-2 transition-colors whitespace-nowrap ${
                filter === f ? "border-saffron-500 text-saffron-400" : "border-transparent text-ink-500 hover:text-ink-200"
              }`}
            >
              {f === "all" ? `All (${orders.length})` : `${STATUS_LABEL[f]} (${orders.filter((o) => o.status === f).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <div className="px-6 py-2 flex items-center gap-2 border-b border-ink-900">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-ink-600 text-xs">Auto-refreshes every 8s · Last: {lastRefresh.toLocaleTimeString()}</span>
      </div>

      {/* Orders */}
      <div className="px-4 sm:px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="w-8 h-8 animate-spin text-saffron-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : shown.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ink-600 text-4xl mb-3">🍽</p>
            <p className="text-ink-500 text-sm">No {filter !== "all" ? filter : ""} orders yet</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {shown.map((order) => {
              const action = actionLabel(order.status);
              return (
                <div
                  key={order.id}
                  className={`bg-ink-900 rounded-xl border p-5 flex flex-col gap-4 transition-colors ${
                    order.status === "pending" ? "border-yellow-700/50" :
                    order.status === "ready"   ? "border-green-700/50"  : "border-ink-700"
                  }`}
                >
                  {/* Order header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white font-black text-lg">Table {order.tableId}</span>
                        {order.customerName && (
                          <span className="text-ink-500 text-xs">— {order.customerName}</span>
                        )}
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

                  {/* Items */}
                  <div className="bg-ink-950 rounded-lg px-3 py-3 space-y-1.5 border border-ink-800">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-ink-200">
                          <span className="text-saffron-500 font-bold mr-1.5">×{item.quantity}</span>
                          {item.name}
                        </span>
                        <span className="text-ink-500 tabular-nums">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    {order.notes && (
                      <p className="text-ink-500 text-xs pt-1.5 border-t border-ink-800 italic">
                        Note: {order.notes}
                      </p>
                    )}
                  </div>

                  {/* Total + action */}
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
                    {!action && order.status === "served" && (
                      <span className="text-ink-600 text-xs font-bold uppercase tracking-widest">Done</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer links */}
      <div className="px-6 py-4 border-t border-ink-900 flex gap-4 text-xs text-ink-600">
        <a href="/admin/qr-codes" className="hover:text-saffron-400 transition-colors">QR Codes →</a>
        <a href="/" className="hover:text-ink-400 transition-colors">Back to Site</a>
      </div>
    </div>
  );
}
