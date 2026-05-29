import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!await verifyRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabaseAdmin.from("opening_hours").select("*").order("day_index");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ hours: data });
}

export async function PUT(req: NextRequest) {
  if (!await verifyRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { hours } = await req.json() as { hours: { id: string; is_open: boolean; hours: string }[] };
  const updates = hours.map(({ id, is_open, hours: h }) =>
    supabaseAdmin.from("opening_hours").update({ is_open, hours: h }).eq("id", id)
  );
  await Promise.all(updates);
  return NextResponse.json({ success: true });
}
