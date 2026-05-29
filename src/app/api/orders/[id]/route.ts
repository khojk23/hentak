import { NextRequest, NextResponse } from "next/server";
import { orderStore, type OrderStatus } from "@/lib/orderStore";

const VALID_STATUSES: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "served"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let body: { status: OrderStatus };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 422 });
  }

  const updated = orderStore.updateStatus(params.id, body.status);
  if (!updated) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, order: orderStore.get(params.id) });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const order = orderStore.get(params.id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ order });
}
