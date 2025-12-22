import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const LIMIT = 9;

type Params = {
  userId: string;
  page?: number;
};

export const fetchCart = async ({ userId, page = 1 }: Params) => {
  "use cache";
  cacheTag(cacheKeys.carts);

  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    select: {
      _count: {
        select: {
          cartItems: true,
        },
      },
    },
    // include: {
    //   _count: {
    //     select: {
    //       cartItems: true,
    //     },
    //   },
    // },
  });

  const result = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      cartItems: {
        orderBy: {
          createdAt: "desc",
        },
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        include: {
          product: {
            include: {
              category: {
                select: {
                  title: true,
                },
              },
              productImages: {
                select: {
                  url: true,
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  return {
    cart: result,
    total: cart?._count.cartItems ?? 0,
    itemsPerPage: LIMIT,
  };
};

export type CartItem = NonNullable<
  Awaited<ReturnType<typeof fetchCart>>["cart"]
>["cartItems"][number];
