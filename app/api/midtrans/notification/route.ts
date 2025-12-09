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

// notification received {
//   va_numbers: [ { va_number: '917804566517257261', bank: 'bri' } ],
//   transaction_time: '2025-12-09 12:34:17',
//   transaction_status: 'settlement',
//   transaction_id: '2c9f499b-b409-4691-80e4-06ccefec12c6',
//   status_message: 'midtrans payment notification',
//   status_code: '200',
//   signature_key: '28e68500ce935747cf3a4b95bc287bf76af22048a860df6acfe6e51d424c3a922063bc1d3771d8fe5d2d5baa1831792f1b7cc9cf4f669833a2c505173ecaad82',
//   settlement_time: '2025-12-09 12:34:33',
//   payment_type: 'bank_transfer',
//   payment_amounts: [],
//   order_id: '21723c17-9940-4f9f-8475-28522417ec2e-1765183797045',
//   merchant_id: 'G059291780',
//   gross_amount: '9070.00',
//   fraud_status: 'accept',
//   expiry_time: '2025-12-10 12:34:17',
//   customer_details: { email: 'jeff58@yahoo.com' },
//   currency: 'IDR'
// }
