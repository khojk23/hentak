export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "served";

export interface CartItem {
  id:       string;
  name:     string;
  price:    number;
  quantity: number;
}

export interface Order {
  id:           string;
  tableId:      string;
  items:        CartItem[];
  customerName: string;
  notes:        string;
  subtotal:     number;
  tax:          number;
  total:        number;
  status:       OrderStatus;
  createdAt:    string;
  servedAt?:    string;
}

// Module-level singleton — persists for the lifetime of the server process
const store = new Map<string, Order>();

export const orderStore = {
  add(order: Order) {
    store.set(order.id, order);
  },
  getAll(): Order[] {
    return Array.from(store.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  getByTable(tableId: string): Order[] {
    return this.getAll().filter((o) => o.tableId === tableId);
  },
  get(id: string): Order | undefined {
    return store.get(id);
  },
  updateStatus(id: string, status: OrderStatus): boolean {
    const order = store.get(id);
    if (!order) return false;
    store.set(id, {
      ...order,
      status,
      ...(status === "served" ? { servedAt: new Date().toISOString() } : {}),
    });
    return true;
  },
  count(): number {
    return store.size;
  },
};

export function generateOrderId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `HNK-${suffix}`;
}
