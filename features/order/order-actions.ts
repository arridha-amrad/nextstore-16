"use server";

import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { updateTag } from "next/cache";
import z from "zod";
import { zfd } from "zod-form-data";

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

export const reviewProductAction = authActionClient
  .inputSchema(
    zfd.formData({
      rating: zfd.numeric(),
      comment: zfd.text(),
      productId: zfd.text(),
      orderId: zfd.text(),
    }),
    {
      handleValidationErrorsShape: async (ve) =>
        flattenValidationErrors(ve).fieldErrors,
    }
  )
  .action(
    async ({
      parsedInput: { rating, comment, productId, orderId },
      ctx: { userId },
    }) => {
      await prisma.productReview.create({
        data: {
          orderId,
          rating,
          comment,
          userId,
          productId,
        },
      });
      updateTag(cacheKeys.orders.admin);
      updateTag(cacheKeys.orders.pending);
      return "ok";
    }
  );
