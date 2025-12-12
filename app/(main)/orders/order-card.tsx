"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { env } from "@/lib/env";
import { cn, formatToIDR, getAfterDiscountPrice } from "@/lib/utils";
import { Ship, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Order } from "./query";
import { useRouter } from "nextjs-toploader/app";
import { completeOrderAction } from "./action";
import toast from "react-hot-toast";
import { ReviewDialog } from "./review-dialog";

type Props = {
  order: Order;
};

const getMidtransToken = async (orderId: string) => {
  const response = await fetch(`${env.nextPublicBaseUrl}/api/midtrans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ order_id: orderId }),
  });
  const data = await response.json();
  return data;
};

export default function OrderCard({ order }: Props) {
  const router = useRouter();
  const pay = async (orderId: string) => {
    try {
      window.snap.show();
      const token = await getMidtransToken(orderId);
      window.snap.pay(token.token, {
        onSuccess: function (result: any) {
          // router.push("/payment/success");
          router.refresh();
        },
        onPending: function (result: any) {
          console.log("Pending", result);
        },
        onError: function (result: any) {
          console.log(result);
          router.push("/payment/error");
        },
      });
    } catch (error) {
      window.snap.hide();
    }
  };
  return (
    <Card className="w-max">
      <CardContent className="space-y-4">
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag />
          <Badge
            variant={"secondary"}
            className={cn(order.status === "Completed" ? "text-primary" : "")}
          >
            {order.status}
          </Badge>
          <p>{order.id}</p>
        </CardTitle>
        <div>
          {order.orderItems.map((item) => (
            <div className="flex items-center gap-2" key={item.id}>
              <Link
                href={`${env.nextPublicBaseUrl}/${item.product.slug}`}
                className="font-bold"
              >
                {item.productName}
              </Link>
              <p className="font-light text-sm text-foreground/70">
                {item.quantity} x{" "}
                {formatToIDR(
                  getAfterDiscountPrice(item.priceAtOrder, item.discountAtOrder)
                )}
              </p>
            </div>
          ))}
          <p>
            <span className="font-bold">
              Courier {order.shippingProvider}&nbsp;
            </span>
            <span className="font-light text-sm text-foreground/70">
              1 x {order.shippingCost}
            </span>
          </p>
        </div>
        <div className="flex items-center">
          <Ship />
          &nbsp;
          <p className="text-sm">
            to {order.orderShipping?.province}, {order.orderShipping?.city},{" "}
            {order.orderShipping?.district}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="">Total Shopping</h1>
            <p className="text-sm font-bold">{formatToIDR(order.total!)}</p>
          </div>
          <div className="flex items-center gap-2">
            {order.status === "Paid" && (
              <Badge className="animate-pulse" variant={"secondary"}>
                processing...
              </Badge>
            )}
            {order.status === "Shipped" && (
              <Button
                onClick={async () => {
                  const result = await completeOrderAction({
                    orderId: order.id,
                  });
                  if (result.data) {
                    toast.success(result.data);
                    return;
                  }
                }}
              >
                Complete
              </Button>
            )}
            {order.status === "Completed" && <ReviewDialog order={order} />}
            {order.status === "Pending" && (
              <Button onClick={async () => await pay(order.id)}>Pay</Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
