import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyRequest } from "@/lib/auth";

const ALLOWED_BUCKETS = ["gallery", "slideshow", "menu-images"];

export async function POST(req: NextRequest) {
  if (!await verifyRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form   = await req.formData();
  const file   = form.get("file") as File | null;
  const bucket = (form.get("bucket") as string) || "gallery";

  if (!file)                           return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!ALLOWED_BUCKETS.includes(bucket)) return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });

  const ext    = file.name.split(".").pop() ?? "jpg";
  const path   = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({ url: publicUrl, path }, { status: 201 });
}
