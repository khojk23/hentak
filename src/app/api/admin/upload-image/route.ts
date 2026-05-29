import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyRequest } from "@/lib/auth";

export const maxDuration = 30;

const ALLOWED_BUCKETS = ["gallery", "slideshow", "menu-images"];

// Detect MIME type from buffer magic bytes when browser doesn't set Content-Type
function detectMime(buffer: Buffer): string {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return "image/jpeg";
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return "image/png";
  if (buffer[0] === 0x47 && buffer[1] === 0x49) return "image/gif";
  if (buffer[0] === 0x52 && buffer[1] === 0x49) return "image/webp";
  return "image/jpeg"; // safe default for camera captures
}

function getExt(filename: string, mime: string): string {
  const fromName = filename.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "gif", "webp", "heic", "heif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  const mimeMap: Record<string, string> = {
    "image/jpeg": "jpg", "image/png": "png",
    "image/gif":  "gif", "image/webp": "webp",
    "image/heic": "jpg", "image/heif": "jpg",
  };
  return mimeMap[mime] ?? "jpg";
}

export async function POST(req: NextRequest) {
  if (!await verifyRequest(req)) {
    return NextResponse.json({ error: "Unauthorized — please log in again" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Could not parse upload — file may be too large (max 4.5MB)" }, { status: 400 });
  }

  const file   = form.get("file") as File | null;
  const bucket = (form.get("bucket") as string) || "gallery";

  if (!file)                             return NextResponse.json({ error: "No file received" }, { status: 400 });
  if (!ALLOWED_BUCKETS.includes(bucket)) return NextResponse.json({ error: "Invalid bucket" },  { status: 400 });

  const bytes  = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (buffer.length === 0) return NextResponse.json({ error: "File is empty" }, { status: 400 });
  if (buffer.length > 4_500_000) return NextResponse.json({ error: "File too large — max 4.5MB. Please compress the image first." }, { status: 413 });

  const mime    = file.type || detectMime(buffer);
  const ext     = getExt(file.name ?? "", mime);
  const path    = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, buffer, { contentType: mime, upsert: false });

  if (uploadError) {
    console.error("[upload-image]", uploadError.message);
    return NextResponse.json({ error: `Storage error: ${uploadError.message}` }, { status: 500 });
  }

  const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({ url: publicUrl, path }, { status: 201 });
}
