import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyRequest } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await verifyRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get storage path first
  const { data: row } = await supabaseAdmin
    .from("gallery_images")
    .select("storage_path")
    .eq("id", params.id)
    .single();

  if (row?.storage_path) {
    await supabaseAdmin.storage.from("gallery").remove([row.storage_path]);
  }

  const { error } = await supabaseAdmin.from("gallery_images").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
