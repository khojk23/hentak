"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MENU } from "@/lib/data";

interface MenuItem {
  id: string; category: string; name: string; meitei?: string;
  description: string; price: number; tag?: string; image_url?: string;
}

const TAG_COLORS: Record<string, string> = {
  "Signature":     "bg-saffron-100 text-saffron-700 dark:bg-saffron-900/60 dark:text-saffron-300",
  "Chef's Pick":   "bg-forest-100 text-forest-700 dark:bg-forest-900/60 dark:text-forest-300",
  "Vegetarian":    "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300",
  "Must Try":      "bg-clay-100 text-clay-700 dark:bg-clay-900/60 dark:text-clay-300",
  "New":           "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300",
  "Non-Alcoholic": "bg-ink-100 text-ink-600 dark:bg-ink-700/60 dark:text-ink-300",
};

const CATEGORIES = ["Starters", "Mains", "Desserts", "Drinks"];

export default function MenuPage() {
  const [active, setActive] = useState("Starters");
  const [itemMap, setItemMap] = useState<Record<string, MenuItem[]>>(() =>
    Object.fromEntries(
      Object.entries(MENU).map(([cat, dishes]) => [
        cat,
        dishes.map((d) => ({
          id: d.id, category: cat, name: d.name, meitei: d.meitei,
          description: d.description, price: d.price, tag: d.tag,
        })),
      ])
    )
  );

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
      .catch(() => {});
  }, []);

  const tabs    = CATEGORIES.filter((c) => itemMap[c]?.length);
  const current = itemMap[active] ?? [];

  return (
    <div className="min-h-screen bg-ink-950 pt-[108px]">
      {/* Header */}
      <div className="py-12 text-center px-4 border-b border-ink-800">
        <p className="text-saffron-600 text-xs tracking-[0.3em] uppercase mb-3 font-medium">Imphal, Manipur</p>
        <h1 className="font-display text-5xl sm:text-6xl text-foreground font-light">Our Menu</h1>
        <p className="text-ink-500 text-sm mt-2 italic font-display">Fermented · Foraged · Celebrated</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActive(tab)}
              className={`px-6 py-2 rounded-full text-sm transition-colors ${
                active === tab
                  ? "bg-saffron-600 text-white font-medium"
                  : "bg-ink-800 text-ink-400 hover:bg-ink-700 hover:text-foreground border border-ink-700"
              }`}
            >{tab}</button>
          ))}
        </div>

        {/* Menu list */}
        <div className="divide-y divide-ink-800/60">
          {current.map((item) => (
            <article key={item.id}
              className="flex items-center gap-4 py-4 px-3 -mx-3 rounded-xl hover:bg-ink-900/40 transition-colors group">

              {/* Thumbnail */}
              {item.image_url ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 ring-1 ring-ink-700 group-hover:ring-saffron-500/40 transition-all">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl shrink-0 bg-ink-800 ring-1 ring-ink-700 flex items-center justify-center text-2xl text-ink-600">
                  🍽
                </div>
              )}

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-foreground text-xl font-normal leading-snug truncate">
                    {item.name}
                  </h2>
                  <span className="text-saffron-600 font-semibold text-sm whitespace-nowrap shrink-0">
                    ₹{item.price}
                  </span>
                </div>
                {item.meitei && (
                  <p className="text-ink-500 text-xs mt-0.5 font-display italic">{item.meitei}</p>
                )}
                <p className="text-ink-400 text-sm leading-relaxed mt-1 line-clamp-2">
                  {item.description}
                </p>
                {item.tag && (
                  <span className={`inline-block text-[10px] font-medium px-2.5 py-0.5 mt-1.5 rounded-full ${TAG_COLORS[item.tag] ?? "bg-ink-700 text-ink-300"}`}>
                    {item.tag}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        <p className="text-center text-ink-600 text-xs mt-10 leading-relaxed">
          Some dishes contain fish, fermented ingredients, nuts, or gluten.<br />
          Please inform your server of any allergies.
        </p>
      </div>
    </div>
  );
}
