import { env } from "@/lib/env";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Payment Success</h1>
      <p className="text-sm">Thank you for your payment</p>
      <Link className="mt-4 bg-primary px-4 py-2 rounded-md text-black" href={`${env.nextPublicBaseUrl}/orders`}>
        Back to Orders
      </Link>
    </div>
  );
}
