import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!await verifyRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabaseAdmin.from("gallery_images").select("*").order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ images: data });
}

export async function POST(req: NextRequest) {
  if (!await verifyRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const alt  = (form.get("alt") as string) || "Hentak restaurant image";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  // Upload to Supabase Storage
  const ext      = file.name.split(".").pop() ?? "jpg";
  const path     = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const bytes    = await file.arrayBuffer();
  const buffer   = Buffer.from(bytes);

  const { error: uploadError } = await supabaseAdmin.storage
    .from("gallery")
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = supabaseAdmin.storage.from("gallery").getPublicUrl(path);

  // Save to DB
  const { data: row, error: dbError } = await supabaseAdmin
    .from("gallery_images")
    .insert({ storage_path: path, url: publicUrl, alt })
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ image: row }, { status: 201 });
}
