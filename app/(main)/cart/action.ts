"use server";

import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { authActionClient, MyCustomError } from "@/lib/safe-action";
import { getAfterDiscountPrice } from "@/lib/utils";
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

export const placeOrderAction = authActionClient
  .inputSchema(
    z.object({
      shipping: z.object({
        code: z.string(),
        cost: z.number(),
        description: z.string().optional(),
        etd: z.string().optional(),
        name: z.string().optional(),
        service: z.string().optional(),
      }),
      address: z.object({
        province: z.string(),
        city: z.string(),
        district: z.string(),
        phoneNumber: z.string(),
        fullname: z.string(),
        address: z.string(),
        postalCode: z.string(),
      }),
    })
  )
  .action(async ({ ctx: { userId }, parsedInput: { address, shipping } }) => {
    try {
      const cart = await prisma.cart.findUnique({
        where: {
          userId,
        },
      });

      if (!cart) {
        throw new MyCustomError("cart not found");
      }

      const items = await prisma.cartItem.findMany({
        where: {
          cartId: cart.id,
          isSelected: true,
          quantity: {
            gte: 1,
          },
        },
        include: {
          product: true,
        },
      });

      // init order
      const subTotal = items
        .map((item) => item.quantity * getAfterDiscountPrice(item.product.price, item.product.discount))
        .reduce((cv, pv) => {
          pv += cv;
          return pv;
        }, 0);
      await prisma.order.create({
        data: {
          subTotal,
          userId,
          total: subTotal + shipping.cost,
          shippingCost: shipping.cost,
          shippingProvider: shipping.name,
          shippingService: shipping.service,
          orderShipping: {
            create: {
              address: address.address,
              city: address.city,
              district: address.district,
              fullname: address.fullname,
              phoneNumber: address.phoneNumber,
              province: address.province,
              postalCode: address.postalCode,
            },
          },
          orderItems: {
            create: items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              priceAtOrder: item.product.price,
              discountAtOrder: item.product.discount,
              quantity: item.quantity,
            })),
          },
        },
      });

      // delete cart items
      await prisma.cartItem.deleteMany({
        where: {
          id: { in: items.map((item) => item.id) },
        },
      });

      updateTag(cacheKeys.carts);
      updateTag(cacheKeys.orders.pending);
      return "ok";
    } catch (err) {
      console.log(err);
      throw err;
    }
  });
