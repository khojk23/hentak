import { NextRequest, NextResponse } from "next/server";
import { orderStore, generateOrderId, type CartItem } from "@/lib/orderStore";

export async function POST(request: NextRequest) {
  let body: {
    tableId: string;
    items: CartItem[];
    customerName?: string;
    notes?: string;
    subtotal: number;
    tax: number;
    total: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.tableId) return NextResponse.json({ error: "tableId is required" }, { status: 422 });
  if (!body.items?.length) return NextResponse.json({ error: "Order must have at least one item" }, { status: 422 });

  const order = {
    id:           generateOrderId(),
    tableId:      body.tableId,
    items:        body.items,
    customerName: body.customerName?.trim() || "",
    notes:        body.notes?.trim() || "",
    subtotal:     body.subtotal,
    tax:          body.tax,
    total:        body.total,
    status:       "pending" as const,
    createdAt:    new Date().toISOString(),
  };

  orderStore.add(order);
  console.log(`[Order] ${order.id} — Table ${order.tableId} — ₹${order.total}`);

  return NextResponse.json({ success: true, orderId: order.id, order }, { status: 201 });
}

export async function GET() {
  return NextResponse.json({ orders: orderStore.getAll() });
}
