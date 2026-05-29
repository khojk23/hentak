import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!await verifyRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabaseAdmin.from("restaurant_settings").select("key, value");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: Object.fromEntries((data ?? []).map(r => [r.key, r.value])) });
}

export async function PUT(req: NextRequest) {
  if (!await verifyRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { settings } = await req.json() as { settings: Record<string, string> };
  const upserts = Object.entries(settings).map(([key, value]) =>
    supabaseAdmin.from("restaurant_settings").upsert({ key, value, updated_at: new Date().toISOString() })
  );
  await Promise.all(upserts);
  return NextResponse.json({ success: true });
}
