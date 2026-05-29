import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyRequest } from "@/lib/auth";
import { MENU, GALLERY_IMAGES } from "@/lib/data";

export async function POST(req: NextRequest) {
  if (!await verifyRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only seed if tables are empty
  const { count: menuCount } = await supabaseAdmin
    .from("menu_items").select("*", { count: "exact", head: true });

  if ((menuCount ?? 0) === 0) {
    const items = Object.entries(MENU).flatMap(([category, dishes], ci) =>
      dishes.map((d, i) => ({
        category,
        name:        d.name,
        meitei:      d.meitei ?? "",
        description: d.description,
        price:       d.price,
        tag:         d.tag ?? "",
        available:   true,
        sort_order:  ci * 100 + i,
      }))
    );
    await supabaseAdmin.from("menu_items").insert(items);
  }

  const { count: galleryCount } = await supabaseAdmin
    .from("gallery_images").select("*", { count: "exact", head: true });

  if ((galleryCount ?? 0) === 0) {
    const images = GALLERY_IMAGES.map((img, i) => ({
      storage_path: "",
      url:          img.src,
      alt:          img.alt,
      sort_order:   i,
    }));
    await supabaseAdmin.from("gallery_images").insert(images);
  }

  return NextResponse.json({ success: true, message: "Database seeded with existing content" });
}
