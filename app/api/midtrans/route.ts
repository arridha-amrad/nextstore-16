import { env } from "@/lib/env";
import prisma from "@/lib/prisma";
import { getAfterDiscountPrice } from "@/lib/utils";
import { Snap } from "midtrans-client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const orderId = body.order_id;

  if (!orderId || typeof orderId !== "string") {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      user: true,
      orderShipping: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  for (const item of order.orderItems) {
    const product = await prisma.product.findUnique({
      where: {
        id: item.productId,
      },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json({ error: "Stock not enough" }, { status: 400 });
    }
  }

  let snap = new Snap({
    // Set to true if you want Production Environment (accept real transaction).
    isProduction: false,
    serverKey: env.midtransServerKey,
    clientKey: env.midtransClientKey,
  });

  let parameter = {
    transaction_details: {
      order_id: `${order.id}__${order.createdAt.getTime()}`,
      gross_amount: order.total,
    },
    item_details: order.orderItems
      .map((item) => ({
        id: item.id,
        price: getAfterDiscountPrice(item.priceAtOrder, item.discountAtOrder),
        quantity: item.quantity,
        name: item.productName,
      }))
      .concat({
        id: `shipping-${order.orderShipping?.id.toString()}`,
        price: order.shippingCost,
        quantity: 1,
        name: order.shippingProvider,
      }),
    credit_card: {
      secure: true,
    },
    customer_details: {
      name: order.user.name,
      email: order.user.email,
    },
  };

  const tokenResult = await snap.createTransaction(parameter);
  return NextResponse.json(tokenResult, { status: 200 });
};
