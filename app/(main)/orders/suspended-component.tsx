import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import OrderList from "./order-list";
import { fetchOrders } from "./query";

export default async function OrdersSuspendedComponent() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin?callbackUrl=/orders");
  }

  const orders = await fetchOrders({ userId: session.user.id });
  if (orders.length === 0) {
    return <p>Record not found</p>;
  }

  return <OrderList orders={orders} />;
}
