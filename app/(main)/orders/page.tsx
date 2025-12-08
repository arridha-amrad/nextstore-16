import { Suspense } from "react";
import OrdersSuspendedComponent from "./suspended-component";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nextstore | Orders",
};

export default function UserOrdersPage() {
  return (
    <Suspense>
      <OrdersSuspendedComponent />
    </Suspense>
  );
}
