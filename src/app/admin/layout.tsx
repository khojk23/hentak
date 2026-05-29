"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { href: "/admin",           label: "Dashboard", icon: "📊" },
  { href: "/admin/menu",      label: "Menu",      icon: "🍽"  },
  { href: "/admin/slideshow", label: "Slideshow", icon: "🖼"  },
  { href: "/admin/gallery",   label: "Gallery",   icon: "📷" },
  { href: "/admin/hours",    label: "Hours",     icon: "🕐"  },
  { href: "/admin/settings", label: "Settings",  icon: "⚙️"  },
  { href: "/admin/orders",       label: "Orders",       icon: "📋" },
  { href: "/admin/reservations", label: "Reservations", icon: "🗓" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname    = usePathname();
  const router      = useRouter();
  const [busy, setBusy] = useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    setBusy(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-ink-950 text-white flex flex-col">
      {/* Top bar */}
      <header className="bg-[#0a0806] border-b border-ink-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="text-white font-black text-sm tracking-widest uppercase">HENTAK.</span>
          <span className="text-ink-600 text-xs">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a href="/" target="_blank" className="text-ink-500 hover:text-ink-300 text-xs transition-colors">View Site ↗</a>
          <button onClick={logout} disabled={busy} className="text-ink-500 hover:text-red-400 text-xs transition-colors">
            {busy ? "…" : "Sign Out"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar — desktop */}
        <nav className="hidden md:flex flex-col w-52 bg-ink-900 border-r border-ink-800 py-4 px-3 gap-1 shrink-0">
          {NAV.map(({ href, label, icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-saffron-600/20 text-saffron-400 border border-saffron-700/40"
                    : "text-ink-400 hover:text-white hover:bg-ink-800"
                }`}
              >
                <span>{icon}</span>{label}
              </Link>
            );
          })}
        </nav>

        {/* Main */}
        <main className="flex-1 overflow-auto pb-24 md:pb-6">{children}</main>
      </div>

      {/* Bottom nav — mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-ink-900 border-t border-ink-800 flex z-40">
        {NAV.map(({ href, label, icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-[8px] font-bold tracking-wider uppercase transition-colors ${
                active ? "text-saffron-400" : "text-ink-600"
              }`}
            >
              <span className="text-lg">{icon}</span>{label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
