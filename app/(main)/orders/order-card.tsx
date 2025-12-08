"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { env } from "@/lib/env";
import { formatToIDR, getAfterDiscountPrice } from "@/lib/utils";
import { Ship, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Order } from "./query";

type Props = {
  order: Order;
};

export default function OrderCard({ order }: Props) {
  return (
    <Card className="w-max">
      <CardContent className="space-y-4">
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag />
          <Badge variant={"secondary"}>{order.status}</Badge>
          <p>{order.id}</p>
        </CardTitle>
        <div>
          {order.orderItems.map((item) => (
            <div className="flex items-center gap-2" key={item.id}>
              <Link href={`${env.nextPublicBaseUrl}/${item.product.slug}`} className="font-bold">
                {item.productName}
              </Link>
              <p className="font-light text-sm text-foreground/70">
                {item.quantity} x {formatToIDR(getAfterDiscountPrice(item.priceAtOrder, item.discountAtOrder))}
              </p>
            </div>
          ))}
          <p>
            <span className="font-bold">Courier {order.shippingProvider}&nbsp;</span>
            <span className="font-light text-sm text-foreground/70">1 x {order.shippingCost}</span>
          </p>
        </div>
        <div className="flex items-center">
          <Ship />
          &nbsp;
          <p className="text-sm">
            to {order.orderShipping?.province}, {order.orderShipping?.city}, {order.orderShipping?.district}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="">Total Shopping</h1>
            <p className="text-sm font-bold">{formatToIDR(order.total!)}</p>
          </div>
          <Button>Pay</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
