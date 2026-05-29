"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export interface Slide { src: string; alt: string; }

const FALLBACK_SLIDES: Slide[] = [
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=900&fit=crop&q=85", alt: "Hentak restaurant — warm intimate dining room, Imphal" },
  { src: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1600&h=900&fit=crop&q=85", alt: "Traditional Manipuri curry — slow-cooked, aromatic" },
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=900&fit=crop&q=85", alt: "Manipuri thali spread — complete traditional meal" },
  { src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&h=900&fit=crop&q=85", alt: "Singju — fresh herb salad with fermented dressing" },
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=900&fit=crop&q=85", alt: "Hentak evening dining — candlelit atmosphere" },
];

const INTERVAL = 4500;

export default function HeroCarousel({ slides }: { slides?: Slide[] }) {
  const SLIDES = (slides && slides.length > 0) ? slides : FALLBACK_SLIDES;

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
    setProgress(0);
  }, [SLIDES.length]);

  useEffect(() => {
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  useEffect(() => {
    setProgress(0);
    const tick = setInterval(() => {
      setProgress((p) => Math.min(p + 100 / (INTERVAL / 50), 100));
    }, 50);
    return () => clearInterval(tick);
  }, [current]);

  return (
    <div className="relative w-full h-[62vh] min-h-[400px] overflow-hidden bg-ink-950">
      {SLIDES.map((slide, i) => (
        <div key={i} aria-hidden={i !== current}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <Image src={slide.src} alt={slide.alt} fill priority={i === 0}
            className="object-cover" sizes="100vw"
            unoptimized={slide.src.includes("supabase")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-ink-950/20" />
        </div>
      ))}

      {/* Counter */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5 bg-ink-950/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
        <span className="text-saffron-400 text-xs font-bold tabular-nums">{String(current + 1).padStart(2, "0")}</span>
        <span className="text-white/30 text-xs">/</span>
        <span className="text-white/50 text-xs tabular-nums">{String(SLIDES.length).padStart(2, "0")}</span>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => { setCurrent(i); setProgress(0); }}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-7 h-1.5 bg-saffron-500" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-ink-700 z-20">
        <div className="h-full bg-saffron-500 transition-none" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
