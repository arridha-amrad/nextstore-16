"use client";

import { useEffect } from "react";
import OrderCard from "./order-card";
import { Order } from "./query";
import { env } from "@/lib/env";

type Props = {
  orders: Order[];
};

export default function OrderList({ orders }: Props) {
  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = env.midtransPublicClientKey;
    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    scriptTag.async = true;
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <>
      <div className="flex gap-4 flex-wrap">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </>
  );
}
