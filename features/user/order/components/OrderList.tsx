import OrderCard from "@/components/cards/OrderCard";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchOrders } from "../order-queries";

export default async function OrderList() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin?callbackUrl=/orders");
  }

  const orders = await fetchOrders({ userId: session.user.id });
  if (orders.length === 0) {
    return <p>Record not found</p>;
  }
  return (
    <div className="grid lg:grid-cols-2 gap-4 grid-cols-1">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
