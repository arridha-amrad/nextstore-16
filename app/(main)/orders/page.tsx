import MidtransProvider from "@/components/MidtransProvider";
import OrderList from "@/features/user/order/components/OrderList";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Nextstore | Orders",
};

export default function UserOrdersPage() {
  return (
    <MidtransProvider>
      <Suspense>
        <OrderList />
      </Suspense>
    </MidtransProvider>
  );
}
