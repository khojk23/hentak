import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { RESTAURANT, FEATURED_DISHES } from "@/lib/data";
import { getSlideshowImages, getOpeningHours } from "@/lib/supabase";
import HeroCarousel from "@/components/HeroCarousel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hentak. — Nouvelle Manipuri Cuisine",
};

export default async function HomePage() {
  const [slideshowImages, dbHours] = await Promise.all([
    getSlideshowImages(),
    getOpeningHours(),
  ]);

  const slides = slideshowImages.map((s) => ({ src: s.url, alt: s.alt }));
  const hours  = dbHours.length > 0 ? dbHours : null;

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────── */}
      <div className="pt-[108px]">
        <HeroCarousel slides={slides} />

        {/* Brand block — clean, minimal */}
        <div className="bg-ink-950 py-14 sm:py-18 border-b border-ink-800">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="text-saffron-600 text-xs tracking-[0.3em] uppercase mb-4 font-medium">
              Imphal, Manipur
            </p>
            <h1 className="font-display text-5xl sm:text-6xl text-foreground mb-3 leading-tight">
              Hentak.
            </h1>
            <p className="text-ink-400 text-base mb-8">
              Nouvelle Manipuri cuisine — fermented, foraged, celebrated.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/reservations"
                className="px-8 py-3 bg-saffron-600 hover:bg-saffron-500 text-white text-sm font-medium rounded-full transition-colors">
                Reserve a Table
              </Link>
              <Link href="/menu"
                className="px-8 py-3 border border-ink-600 hover:border-saffron-500 hover:text-saffron-600 text-ink-300 text-sm font-medium rounded-full transition-colors">
                View Menu
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURED DISHES — the star of the page ────────── */}
      <section className="py-20 bg-ink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground">
              From the kitchen
            </h2>
            <Link href="/menu"
              className="text-sm text-ink-400 hover:text-saffron-600 transition-colors">
              Full menu →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_DISHES.map((dish) => (
              <article key={dish.name}
                className="group rounded-2xl overflow-hidden bg-ink-800 border border-ink-700 hover:border-saffron-500/50 hover:shadow-xl transition-all">
                <div className="relative h-56 overflow-hidden">
                  <Image src={dish.image} alt={dish.alt} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-foreground text-lg leading-snug">{dish.name}</h3>
                  <p className="text-ink-400 text-xs mt-1 leading-relaxed line-clamp-2">{dish.description}</p>
                  <p className="text-saffron-600 font-semibold text-sm mt-3">₹{dish.price}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT — one image, two sentences ──────────────── */}
      <section className="py-20 bg-ink-950 border-t border-b border-ink-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-xl ring-1 ring-ink-700">
              <Image
                src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop&q=80"
                alt="Manipuri dish at Hentak"
                fill className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-saffron-600 text-xs tracking-widest uppercase mb-3 font-medium">Our story</p>
              <h2 className="font-display text-3xl sm:text-4xl text-foreground leading-snug mb-5">
                The soul of the<br />Meitei kitchen
              </h2>
              <p className="text-ink-300 leading-relaxed mb-6">
                Named after hentak — the ancient fermented fish paste of Manipur —
                we honour the ingredients, techniques and flavours that have shaped
                Meitei kitchens for centuries.
              </p>
              <div className="flex gap-3">
                <Link href="/menu"
                  className="px-6 py-2.5 bg-saffron-600 hover:bg-saffron-500 text-white text-sm font-medium rounded-full transition-colors">
                  Explore Menu
                </Link>
                <Link href="/contact"
                  className="px-6 py-2.5 border border-ink-600 hover:border-saffron-500 text-ink-300 hover:text-saffron-600 text-sm font-medium rounded-full transition-colors">
                  Find Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOURS ─────────────────────────────────────────── */}
      <section className="py-20 bg-ink-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-foreground mb-8 text-center">When to visit</h2>
          <div className="divide-y divide-ink-800 rounded-2xl border border-ink-700 overflow-hidden">
            {(hours ?? []).map((h) => (
              <div key={h.day}
                className={`flex justify-between items-center px-6 py-4 ${!h.is_open ? "opacity-30 bg-ink-900" : "bg-ink-800/50"}`}>
                <span className="text-foreground font-medium text-sm">{h.day}</span>
                <span className={`text-sm ${h.is_open ? "text-ink-300" : "text-ink-600 italic"}`}>
                  {h.hours}
                </span>
              </div>
            ))}
          </div>
          <p className="text-ink-500 text-xs text-center mt-4">Last orders 30 minutes before close</p>
        </div>
      </section>

      {/* ── BOOK CTA — simple strip ───────────────────────── */}
      <section className="py-16 bg-saffron-600">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl text-white mb-3">Ready to eat?</h2>
          <p className="text-saffron-100 text-sm mb-7">Walk-ins welcome · Reservations recommended for weekends</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/reservations"
              className="px-8 py-3 bg-white text-saffron-700 hover:bg-saffron-50 text-sm font-semibold rounded-full transition-colors">
              Book a Table
            </Link>
            <a href={`tel:${RESTAURANT.phone}`}
              className="px-8 py-3 border border-white/50 hover:border-white text-white text-sm font-medium rounded-full transition-colors">
              {RESTAURANT.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
