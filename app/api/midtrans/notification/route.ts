import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

import { env } from "@/lib/env";
import crypto from "crypto";

export async function POST(request: Request) {
  const body = await request.json();

  const { signature_key, order_id, status_code, gross_amount } = body;
  const serverKey = env.midtransServerKey;
  const generatedSignature = crypto
    .createHash("sha512")
    .update(order_id + status_code + gross_amount + serverKey)
    .digest("hex");

  if (signature_key !== generatedSignature) {
    return new Response("Invalid Signature", { status: 403 });
  }

  const orderId = body.order_id.split("__")[0];

  if (body.transaction_status === "settlement") {
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "Paid",
        paymentMethod: body.payment_type,
        paymentStatus: "Paid",
      },
      include: {
        orderItems: true,
      },
    });

    for (const item of updatedOrder.orderItems) {
      await prisma.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }
  }
  revalidateTag(cacheKeys.orders.pending, "max");
  return new Response("OK");
}
