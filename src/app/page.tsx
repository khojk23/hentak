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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "Restaurant"],
      "@id": "https://www.hentakrestaurant.com/#restaurant",
      name: "Hentak.",
      description: RESTAURANT.description,
      url: "https://www.hentakrestaurant.com",
      telephone: RESTAURANT.phone,
      email: RESTAURANT.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Imphal",
        addressRegion: "Manipur",
        addressCountry: "IN",
      },
      servesCuisine: ["Manipuri", "Meitei", "Northeast Indian", "Nouvelle"],
      priceRange: "₹₹",
      sameAs: [RESTAURANT.instagram],
    },
  ],
};

const PHILOSOPHY = [
  {
    title: "Fermented & Ancient",
    body: "Hentak, ngari, soibum — our pantry is built on ingredients that Meitei households have fermented for centuries. We don't hide the funk. We celebrate it.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1m20 0h1M4.22 19.78l.707-.707M18.364 5.636l.707-.707" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    title: "Foraged & Seasonal",
    body: "Our kitchen team sources maroi, lotus stem, banana blossom, and wild herbs directly from local farmers and forest foragers across Manipur.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-9-9c0-4.97 4.03-9 9-9s9 4.03 9 9a9 9 0 01-9 9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c0 5 4 8 4 12M12 3c0 5-4 8-4 12" />
      </svg>
    ),
  },
  {
    title: "Nouvelle Manipuri",
    body: "We honour the original recipes while approaching plating, technique, and flavour balance with a contemporary eye. Old soul, new expression.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
];

export default async function HomePage() {
  const [slideshowImages, dbHours] = await Promise.all([
    getSlideshowImages(),
    getOpeningHours(),
  ]);

  const slides = slideshowImages.map((s) => ({ src: s.url, alt: s.alt }));
  const hours  = dbHours.length > 0 ? dbHours : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ─────────────────────────────────────── */}
      <div className="pt-[108px]">
        <HeroCarousel slides={slides} />

        {/* Text block — solid dark, zero blending */}
        <div className="bg-ink-950 py-16 sm:py-20 border-b border-saffron-700/30">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-saffron-400 text-[10px] font-bold tracking-[0.5em] uppercase mb-5">
              Imphal · Manipur · India
            </p>
            <h1 className="text-foreground font-black text-5xl sm:text-6xl md:text-7xl tracking-widest uppercase leading-none mb-4">
              HENTAK.
            </h1>
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="h-px w-16 bg-saffron-600" />
              <span className="text-saffron-400 text-[10px] font-bold tracking-[0.35em] uppercase">
                Nouvelle Manipuri Cuisine
              </span>
              <div className="h-px w-16 bg-saffron-600" />
            </div>
            <p className="text-ink-300 text-sm sm:text-base leading-relaxed mb-10 max-w-xl mx-auto">
              A contemporary dining experience rooted in the ancient fermented food traditions of Manipur.
              The soul of the Meitei kitchen — reimagined.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/reservations" className="px-10 py-4 bg-saffron-600 hover:bg-saffron-500 text-white font-bold tracking-[0.2em] uppercase text-xs rounded transition-colors">
                Reserve a Table
              </Link>
              <Link href="/menu" className="px-10 py-4 border-2 border-ink-600 hover:border-saffron-400 hover:text-saffron-400 text-foreground font-bold tracking-[0.2em] uppercase text-xs rounded transition-colors">
                View Menu
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── ANNOUNCEMENT STRIP ─────────────────────────── */}
      <div className="bg-saffron-600 py-3">
        <p className="text-white text-[10px] font-bold tracking-[0.3em] uppercase text-center">
          ✦ &nbsp; Nouvelle Manipuri Cuisine &nbsp; ✦ &nbsp; Imphal, Manipur &nbsp; ✦ &nbsp; Fermented · Foraged · Celebrated &nbsp; ✦ &nbsp; Open Tue – Sun
        </p>
      </div>

      {/* ── ABOUT / STORY ──────────────────────────────── */}
      <section className="py-24 bg-ink-900 border-b border-ink-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-14 lg:gap-24 items-center">
            <div>
              <p className="text-saffron-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-3">Our Story</p>
              <h2 className="font-black text-4xl sm:text-5xl text-foreground uppercase tracking-tight leading-tight mb-4">
                The Soul of<br />
                <span className="text-forest-500">Meitei</span> Kitchen
              </h2>
              <div className="w-12 h-0.5 bg-saffron-500 mb-6" />
              <p className="text-ink-300 leading-relaxed mb-5 text-sm sm:text-base">
                Hentak is named after one of Manipur&apos;s oldest and most revered ingredients — a fermented paste of sun-dried fish and aroid plant, made in earthen pots and passed down through generations. It is not just a condiment. It is memory. It is identity.
              </p>
              <p className="text-ink-400 leading-relaxed mb-8 text-sm sm:text-base">
                Our kitchen is a space where ancient technique meets modern plating. We work with local farmers, foragers, and fishing communities to source ingredients that have shaped Manipuri cuisine for centuries — and we let those ingredients speak for themselves.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/menu" className="px-7 py-3 bg-saffron-600 hover:bg-saffron-500 text-white text-xs font-bold tracking-[0.2em] uppercase rounded transition-colors">
                  Explore Menu
                </Link>
                <Link href="/contact" className="px-7 py-3 border-2 border-ink-600 hover:border-saffron-500 hover:text-saffron-400 text-ink-300 text-xs font-bold tracking-[0.2em] uppercase rounded transition-colors">
                  Visit Us
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-80 sm:h-[480px] rounded-xl overflow-hidden shadow-2xl ring-1 ring-ink-700">
                <Image
                  src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop&q=80"
                  alt="Traditional Manipuri dish at Hentak restaurant"
                  fill className="object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 hidden md:flex flex-col items-center justify-center w-28 h-28 rounded-full bg-saffron-600 text-white shadow-xl">
                <span className="text-2xl font-black">₹₹</span>
                <span className="text-[9px] tracking-[0.15em] uppercase text-saffron-100 text-center leading-tight mt-1">Approachable<br/>Pricing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ─────────────────────────────────── */}
      <section className="py-24 bg-ink-950 border-b border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-saffron-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-3">Our Philosophy</p>
            <h2 className="font-black text-4xl sm:text-5xl text-foreground uppercase tracking-tight">How We Cook</h2>
            <div className="w-12 h-0.5 bg-saffron-500 mx-auto mt-5" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PHILOSOPHY.map((p) => (
              <div key={p.title} className="bg-ink-800 border border-ink-600 hover:border-saffron-500 rounded-xl p-8 transition-colors">
                <div className="w-12 h-12 rounded-full bg-saffron-600/20 border border-saffron-500/50 flex items-center justify-center text-saffron-400 mb-5">
                  {p.icon}
                </div>
                <h3 className="text-foreground font-bold text-lg mb-3">{p.title}</h3>
                <p className="text-ink-300 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED DISHES ────────────────────────────── */}
      <section className="py-24 bg-ink-900 border-b border-ink-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-saffron-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-2">From the Kitchen</p>
              <h2 className="font-black text-4xl sm:text-5xl text-foreground uppercase tracking-tight">Featured Dishes</h2>
              <div className="w-10 h-0.5 bg-saffron-500 mt-4" />
            </div>
            <Link href="/menu" className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-400 hover:text-saffron-400 transition-colors flex items-center gap-2 group">
              Full Menu <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_DISHES.map((dish) => (
              <article key={dish.name} className="group bg-ink-800 border border-ink-600 rounded-xl overflow-hidden hover:border-saffron-500 hover:shadow-xl transition-all">
                <div className="relative h-52 overflow-hidden">
                  <Image src={dish.image} alt={dish.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" />
                </div>
                <div className="p-5 border-t border-ink-600">
                  <h3 className="font-bold text-foreground text-base mb-1">{dish.name}</h3>
                  <p className="text-ink-400 text-xs leading-relaxed mb-3">{dish.description}</p>
                  <p className="text-saffron-400 font-black text-sm">₹{dish.price}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPENING HOURS ──────────────────────────────── */}
      <section className="py-24 bg-ink-950 border-b border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="relative h-72 sm:h-[420px] rounded-xl overflow-hidden shadow-xl ring-1 ring-ink-700">
              <Image src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80" alt="Manipuri thali spread at Hentak" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
            </div>
            <div>
              <p className="text-saffron-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-3">When To Visit</p>
              <h2 className="font-black text-4xl sm:text-5xl text-foreground uppercase tracking-tight mb-2">Opening Hours</h2>
              <div className="w-10 h-0.5 bg-saffron-500 mb-8" />
              <div className="divide-y divide-ink-700">
                {(hours ?? []).map((h) => (
                  <div key={h.day} className={`flex justify-between items-start py-3.5 ${!h.is_open ? "opacity-30" : ""}`}>
                    <span className="font-bold text-foreground text-sm w-28 shrink-0">{h.day}</span>
                    <span className={`text-xs text-right leading-relaxed ${h.is_open ? "text-ink-300" : "italic text-ink-500"}`}>{h.hours}</span>
                  </div>
                ))}
              </div>
              <p className="text-ink-500 text-xs mt-4 italic">Last orders 30 minutes before close.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM ──────────────────────────────────── */}
      <section className="py-16 bg-ink-900 border-b border-ink-700">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-saffron-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-3">Follow the Journey</p>
          <h2 className="font-black text-3xl text-foreground uppercase tracking-tight mb-4">@hentak_restaurant</h2>
          <p className="text-ink-400 text-sm mb-8 max-w-sm mx-auto">Daily stories from the kitchen — on Instagram.</p>
          <a href={RESTAURANT.instagram} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 border-2 border-saffron-500 hover:bg-saffron-600 hover:border-saffron-600 text-saffron-400 hover:text-white text-xs font-bold tracking-[0.2em] uppercase rounded transition-colors">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            Follow on Instagram
          </a>
        </div>
      </section>

      {/* ── RESERVATION CTA ────────────────────────────── */}
      <section className="relative py-32 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&h=700&fit=crop&q=80" alt="Hentak restaurant dining room" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-ink-950/88" />
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-xl mb-8 shadow-lg">
            <Image src="/hentak-logo.jpg" alt="Hentak" width={56} height={56} className="object-contain" />
          </div>
          <h2 className="font-black text-4xl sm:text-5xl text-foreground uppercase tracking-tight mb-2">Reserve Your Table</h2>
          <div className="w-12 h-0.5 bg-saffron-500 mx-auto my-5" />
          <p className="text-ink-300 mb-10 text-sm leading-relaxed">
            Experience Nouvelle Manipuri Cuisine. Walk-ins welcome when available — advance booking recommended for evenings and weekends.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservations" className="px-9 py-4 bg-saffron-600 hover:bg-saffron-500 text-foreground font-bold tracking-[0.2em] uppercase text-xs rounded transition-colors shadow-lg">
              Book a Table
            </Link>
            <a href={`tel:${RESTAURANT.phone}`} className="px-9 py-4 border-2 border-white/40 hover:border-saffron-400 text-white hover:text-saffron-400 font-bold tracking-[0.2em] uppercase text-xs rounded transition-colors">
              Call Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
