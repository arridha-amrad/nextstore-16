import { Suspense } from "react";
import OrdersSuspendedComponent from "./suspended-component";

export default function UserOrdersPage() {
  return (
    <Suspense>
      <OrdersSuspendedComponent />
    </Suspense>
  );
}
