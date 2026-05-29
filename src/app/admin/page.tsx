import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SeedButton from "./SeedButton";

export default async function AdminDashboard() {
  if (!await getSession()) redirect("/admin/login");

  const [{ count: menuCount }, { count: galleryCount }, { count: reservationCount }] = await Promise.all([
    supabaseAdmin.from("menu_items").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("gallery_images").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("reservations").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const cards = [
    { label: "Menu Items",        count: menuCount        ?? 0, href: "/admin/menu",         icon: "🍽",  color: "border-saffron-700/50" },
    { label: "Gallery Photos",    count: galleryCount     ?? 0, href: "/admin/gallery",      icon: "📷", color: "border-blue-700/50"    },
    { label: "Pending Bookings",  count: reservationCount ?? 0, href: "/admin/reservations", icon: "🗓",  color: "border-green-700/50"   },
  ];

  const actions = [
    { label: "Add Menu Item",    href: "/admin/menu",     icon: "➕", desc: "Add a new dish or drink" },
    { label: "Upload Photo",     href: "/admin/gallery",  icon: "📤", desc: "Add a photo to the gallery" },
    { label: "Edit Hours",       href: "/admin/hours",    icon: "🕐",  desc: "Change opening times" },
    { label: "Restaurant Info",  href: "/admin/settings", icon: "✏️",  desc: "Update name, phone, address" },
    { label: "View Orders",       href: "/admin/orders",       icon: "📋", desc: "See live table orders" },
    { label: "Reservations",      href: "/admin/reservations", icon: "🗓",  desc: "View and manage bookings" },
    { label: "Generate QR Codes", href: "/admin/qr-codes",    icon: "📱", desc: "Print QR codes for tables" },
  ];

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-black text-2xl text-white uppercase tracking-tight">Dashboard</h1>
        <p className="text-ink-500 text-sm mt-1">Manage your restaurant from here</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-7">
        {cards.map(c => (
          <Link key={c.label} href={c.href}
            className={`bg-ink-900 border ${c.color} rounded-xl p-4 text-center hover:border-saffron-500 transition-colors`}>
            <p className="text-2xl mb-1">{c.icon}</p>
            <p className="text-white font-black text-2xl tabular-nums">{c.count}</p>
            <p className="text-ink-500 text-[9px] font-bold tracking-widest uppercase mt-0.5">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="font-bold text-ink-300 text-xs tracking-widest uppercase mb-3">Quick Actions</h2>
      <div className="space-y-2">
        {actions.map(a => (
          <Link key={a.label} href={a.href}
            className="flex items-center gap-4 bg-ink-900 border border-ink-700 hover:border-saffron-600 rounded-xl px-4 py-3.5 transition-colors group">
            <span className="text-2xl w-8 text-center shrink-0">{a.icon}</span>
            <div>
              <p className="text-white font-semibold text-sm group-hover:text-saffron-400 transition-colors">{a.label}</p>
              <p className="text-ink-500 text-xs">{a.desc}</p>
            </div>
            <span className="ml-auto text-ink-600 group-hover:text-saffron-500 transition-colors">→</span>
          </Link>
        ))}
      </div>

      {/* First-time setup note */}
      <div className="mt-6 bg-saffron-950/30 border border-saffron-800/40 rounded-xl p-4 text-sm">
        <p className="text-saffron-400 font-bold mb-1">First time setup?</p>
        <p className="text-ink-400 text-xs mb-3">Run the Supabase schema first, then seed your existing menu and gallery.</p>
        <SeedButton />
      </div>
    </div>
  );
}
