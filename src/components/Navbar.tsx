"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Menu",         href: "/menu" },
  { label: "Gallery",      href: "/gallery" },
  { label: "Reservations", href: "/reservations" },
  { label: "Contact",      href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink-950 border-b border-ink-700 shadow-lg">

      {/* ── ROW 1 — Brand ─────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo + wordmark */}
          <Link href="/" className="flex items-center gap-4 group">
            {/* Defined logo container — white bg so the black logo shows correctly */}
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ring-1 ring-white/10 overflow-hidden">
              <Image
                src="/hentak-logo.jpg"
                alt="Hentak logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="leading-none">
              <p className="text-white font-black text-xl tracking-[0.15em] uppercase group-hover:text-saffron-400 transition-colors">
                HENTAK.
              </p>
              <p className="text-ink-400 text-[9px] tracking-[0.22em] uppercase mt-0.5">
                Nouvelle Manipuri Cuisine
              </p>
            </div>
          </Link>

          {/* Desktop — right side CTA */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold tracking-widest uppercase transition-colors ${
                  pathname === link.href
                    ? "text-saffron-400"
                    : "text-ink-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/reservations"
              className="ml-3 px-5 py-2.5 bg-saffron-600 hover:bg-saffron-500 text-white text-xs font-bold tracking-widest uppercase rounded transition-colors"
            >
              Book a Table
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Toggle navigation"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
          >
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 origin-center ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 origin-center ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── BORDER DIVIDER ────────────────────────────── */}
      <div className="border-t border-saffron-700/40" />

      {/* ── ROW 2 — Nav links (desktop only) ──────────── */}
      <div className="hidden md:block bg-ink-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-10 h-9">
            <span className="text-ink-600 text-[9px] tracking-[0.3em] uppercase">Imphal, Manipur</span>
            <div className="flex-1" />
            <span className="text-ink-600 text-[9px] tracking-[0.3em] uppercase">Tue – Sun &nbsp;·&nbsp; Lunch & Dinner</span>
            <a href="tel:+919862100000" className="text-saffron-500 text-[9px] tracking-[0.2em] hover:text-saffron-400 transition-colors">
              +91 98621 00000
            </a>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ───────────────────────────────── */}
      {open && (
        <div className="md:hidden bg-ink-900 border-t border-ink-700 px-4 pb-5 pt-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-3 text-sm font-semibold tracking-widest uppercase border-b border-ink-800 transition-colors ${
                pathname === link.href ? "text-saffron-400" : "text-ink-300 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/reservations"
            className="mt-4 block text-center py-3 bg-saffron-600 hover:bg-saffron-500 text-white text-xs font-bold tracking-widest uppercase rounded transition-colors"
          >
            Book a Table
          </Link>
        </div>
      )}
    </header>
  );
}
