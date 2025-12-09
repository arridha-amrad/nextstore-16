"use server";

import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { updateTag } from "next/cache";
import z from "zod";

export const completeOrderAction = authActionClient
  .inputSchema(
    z.object({
      orderId: z.string(),
    })
  )
  .action(async ({ parsedInput: { orderId } }) => {
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "Completed",
      },
    });
    updateTag(cacheKeys.orders.admin);
    updateTag(cacheKeys.orders.pending);
    return "complete";
  });
