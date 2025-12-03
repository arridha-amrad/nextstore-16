"use server";

import prisma from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
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
      }
      await prisma.cartItem.create({
        data: {
          quantity,
          cartId,
          productId,
        },
      });
      return "added";
    } catch (err) {
      throw err;
    }
  });
