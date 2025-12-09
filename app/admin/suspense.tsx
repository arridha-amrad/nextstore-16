import { Suspense } from "react";
import OrdersTable from "./orders-table";
import { Spinner } from "@/components/ui/spinner";
import { fetchOrders } from "./query";

export default async function SuspenseComponent() {
  const orders = await fetchOrders();

  return (
    <Suspense fallback={<Spinner />}>
      <OrdersTable data={orders} />
    </Suspense>
  );
}
