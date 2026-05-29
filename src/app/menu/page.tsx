"use client";

import { useState, useEffect } from "react";
import { MENU } from "@/lib/data";
import { LinkPreview } from "@/components/ui/link-preview";

interface MenuItem {
  id: string; category: string; name: string; meitei?: string;
  description: string; price: number; tag?: string; image_url?: string;
}

const TAG_COLORS: Record<string, string> = {
  "Signature":    "bg-saffron-900/60 text-saffron-300 border border-saffron-700",
  "Chef's Pick":  "bg-forest-900/60 text-forest-300 border border-forest-700",
  "Vegetarian":   "bg-green-900/60 text-green-300 border border-green-700",
  "Must Try":     "bg-clay-900/60 text-clay-300 border border-clay-700",
  "New":          "bg-sky-900/60 text-sky-300 border border-sky-700",
  "Non-Alcoholic":"bg-ink-700/60 text-ink-300 border border-ink-600",
};

const CATEGORIES = ["Starters", "Mains", "Desserts", "Drinks"];

export default function MenuPage() {
  const [active,  setActive]  = useState("Starters");
  const [itemMap, setItemMap] = useState<Record<string, MenuItem[]>>(() => {
    // Start with hardcoded data while loading
    return Object.fromEntries(
      Object.entries(MENU).map(([cat, dishes]) => [
        cat,
        dishes.map((d) => ({ id: d.id, category: cat, name: d.name, meitei: d.meitei, description: d.description, price: d.price, tag: d.tag })),
      ])
    );
  });

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((json) => {
        if (!json.items?.length) return;
        const grouped: Record<string, MenuItem[]> = {};
        for (const item of json.items as MenuItem[]) {
          if (!grouped[item.category]) grouped[item.category] = [];
          grouped[item.category].push(item);
        }
        setItemMap(grouped);
      })
      .catch(() => {/* keep hardcoded fallback */});
  }, []);

  const tabs    = CATEGORIES.filter((c) => itemMap[c]?.length);
  const current = itemMap[active] ?? [];

  return (
    <div className="min-h-screen bg-ink-950 pt-[108px]">
      <div className="bg-[#0a0806] py-16 text-center px-4 border-b border-ink-800">
        <p className="text-saffron-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-3">What We Serve</p>
        <h1 className="font-black text-5xl sm:text-6xl text-white uppercase tracking-tight mb-3">Our Menu</h1>
        <div className="w-10 h-0.5 bg-saffron-500 mx-auto mb-4" />
        <p className="text-ink-400 max-w-lg mx-auto text-sm leading-relaxed">
          Rooted in Manipuri tradition, expressed with a contemporary hand.
          {" "}<span className="text-ink-600">Hover a dish to see it.</span>
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActive(tab)}
              className={`px-7 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-colors ${
                active === tab
                  ? "bg-saffron-600 text-white shadow-md shadow-saffron-900/50"
                  : "bg-ink-800 text-ink-300 hover:bg-ink-700 hover:text-white border border-ink-600"
              }`}>{tab}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="grid sm:grid-cols-2 gap-5">
          {current.map((item) => (
            <article key={item.id}
              className="bg-ink-900 rounded-xl p-6 border border-ink-700 hover:border-saffron-600/60 hover:shadow-lg hover:shadow-ink-950/50 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-1">
                <div className="flex-1 min-w-0">
                  {/* Name — hover shows dish photo if available */}
                  {item.image_url ? (
                    <LinkPreview imageSrc={item.image_url} imageAlt={item.name} width={260} height={180}>
                      <h2 className="font-bold text-white text-lg tracking-wide hover:text-saffron-300 transition-colors cursor-default inline-block">
                        {item.name}
                        <span className="ml-1.5 text-saffron-600 text-xs align-middle">✦</span>
                      </h2>
                    </LinkPreview>
                  ) : (
                    <h2 className="font-bold text-white text-lg tracking-wide">{item.name}</h2>
                  )}
                  {item.meitei && <p className="text-ink-500 text-xs mt-0.5">{item.meitei}</p>}
                </div>
                <span className="text-saffron-400 font-black text-lg whitespace-nowrap">₹{item.price}</span>
              </div>
              <p className="text-ink-400 text-sm leading-relaxed mb-4 mt-2">{item.description}</p>
              {item.tag && (
                <span className={`inline-block text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${TAG_COLORS[item.tag] ?? "bg-ink-700 text-ink-300 border border-ink-600"}`}>
                  {item.tag}
                </span>
              )}
            </article>
          ))}
        </div>

        <div className="mt-14 text-center border-t border-ink-800 pt-8">
          <p className="text-ink-500 text-xs leading-relaxed max-w-lg mx-auto">
            Some dishes contain fish, fermented soy, gluten, or nuts. Menu changes seasonally.
            Please inform your server of any allergies before ordering.
          </p>
        </div>
      </div>
    </div>
  );
}
