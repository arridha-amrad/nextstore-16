"use server";

import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { updateTag } from "next/cache";
import z from "zod";

export const addToCartAction = authActionClient
  .inputSchema(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
    }),
    {
      handleValidationErrorsShape: async (ve) =>
        flattenValidationErrors(ve).fieldErrors,
    }
  )
  .action(async ({ parsedInput: { quantity, productId }, ctx: { userId } }) => {
    try {
      let cartId = "";
      const cart = await prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        const newCart = await prisma.cart.create({ data: { userId } });
        cartId = newCart.id;
      } else {
        cartId = cart.id;
      }
      await prisma.cartItem.create({
        data: {
          quantity,
          cartId,
          productId,
        },
      });
      updateTag(cacheKeys.carts);
      return "added";
    } catch (err) {
      console.log(err);
      throw err;
    }
  });
