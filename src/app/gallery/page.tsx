import Image from "next/image";
import type { Metadata } from "next";
import { GALLERY_IMAGES, RESTAURANT } from "@/lib/data";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-ink-950 pt-[108px]">
      {/* Header */}
      <div className="bg-[#0a0806] py-16 text-center px-4 border-b border-ink-800">
        <p className="text-saffron-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-3">Visual Stories</p>
        <h1 className="font-black text-5xl sm:text-6xl text-white uppercase tracking-tight mb-3">Gallery</h1>
        <div className="w-10 h-0.5 bg-saffron-500 mx-auto mb-4" />
        <p className="text-ink-400 max-w-xl mx-auto text-sm leading-relaxed">
          The colours of Manipur — on the plate, in the kitchen, in the light.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Masonry */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {GALLERY_IMAGES.map((img, i) => (
            <div key={i} className="break-inside-avoid relative overflow-hidden rounded-xl group ring-1 ring-ink-700">
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={600}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
              />
              <div className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/30 transition-colors duration-300" />
            </div>
          ))}
        </div>

        <div className="text-center mt-14 pt-10 border-t border-ink-800">
          <p className="text-ink-500 text-sm mb-4">More from the kitchen, daily on Instagram</p>
          <a
            href={RESTAURANT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 border-2 border-saffron-500 hover:bg-saffron-600 hover:border-saffron-600 text-saffron-400 hover:text-white text-xs font-bold tracking-[0.2em] uppercase rounded transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            @hentak_restaurant
          </a>
        </div>
      </div>
    </div>
  );
}
