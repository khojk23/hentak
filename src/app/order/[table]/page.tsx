import OrderingClient from "@/components/OrderingClient";

export default function OrderPage({ params }: { params: { table: string } }) {
  const tableId = params.table.toUpperCase();
  return <OrderingClient tableId={tableId} />;
}
