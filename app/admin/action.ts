"use server";

import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { authActionClient, MyCustomError } from "@/lib/safe-action";
import { updateTag } from "next/cache";
import z from "zod";

export const packAndDeliverAction = authActionClient
  .inputSchema(
    z.object({
      orderId: z.string(),
    })
  )
  .action(async ({ parsedInput: { orderId } }) => {
    try {
      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
      });

      if (!order) {
        throw new MyCustomError("order not found");
      }

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: "Shipped",
        },
      });

      updateTag(cacheKeys.orders.admin);
      updateTag(cacheKeys.orders.pending);

      return "Order has been shipped";
    } catch (err) {
      console.log(err);
      throw err;
    }
  });
