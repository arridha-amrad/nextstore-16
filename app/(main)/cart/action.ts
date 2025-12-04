"use server";

import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { authActionClient, MyCustomError } from "@/lib/safe-action";
import { updateTag } from "next/cache";
import z from "zod";

export const toggleCheck = authActionClient
  .inputSchema(
    z.object({
      id: z.string(),
    })
  )
  .action(async ({ ctx: { userId }, parsedInput: { id } }) => {
    try {
      const item = await prisma.cartItem.findUnique({
        where: { id },
      });

      const cart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        throw new MyCustomError("cart not found");
      }

      await prisma.cartItem.update({
        where: {
          id,
        },
        data: {
          isSelected: !item?.isSelected,
        },
      });

      updateTag(cacheKeys.carts);

      return "updated";
    } catch (err) {
      console.log(err);
      throw err;
    }
  });

export const increaseQuantityAction = authActionClient
  .inputSchema(
    z.object({
      currQuantity: z.number(),
      id: z.string(),
    })
  )
  .action(async ({ parsedInput: { currQuantity, id } }) => {
    try {
      await prisma.cartItem.update({
        where: {
          id,
        },
        data: {
          quantity: currQuantity + 1,
        },
      });
      updateTag(cacheKeys.carts);
    } catch (err) {
      console.log(err);
      throw err;
    }
  });

export const decreaseQuantityAction = authActionClient
  .inputSchema(
    z.object({
      currQuantity: z.number(),
      id: z.string(),
    })
  )
  .action(async ({ parsedInput: { currQuantity, id } }) => {
    try {
      await prisma.cartItem.update({
        where: {
          id,
        },
        data: {
          quantity: currQuantity - 1,
        },
      });
      updateTag(cacheKeys.carts);
    } catch (err) {
      console.log(err);
      throw err;
    }
  });

export const deleteCartItemAction = authActionClient
  .inputSchema(
    z.object({
      id: z.string(),
    })
  )
  .action(async ({ parsedInput: { id } }) => {
    try {
      await prisma.cartItem.delete({
        where: {
          id,
        },
      });
      updateTag(cacheKeys.carts);
    } catch (err) {
      console.log(err);
      throw err;
    }
  });
