import { getServerSession } from "@/lib/auth";
import { fetchOrders } from "./query";
import { redirect } from "next/navigation";
import OrderCard from "./order-card";

export default async function OrdersSuspendedComponent() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin?callbackUrl=/orders");
  }

  const orders = await fetchOrders({ userId: session.user.id });
  if (orders.length === 0) {
    return <p>Record not found</p>;
  }

  return (
    <div className="flex gap-x-4 flex-wrap">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
