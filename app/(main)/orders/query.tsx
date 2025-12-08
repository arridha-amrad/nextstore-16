import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

type Params = {
  userId: string;
};
export const fetchOrders = async ({ userId }: Params) => {
  "use cache";
  cacheTag(cacheKeys.orders.pending);

  const result = await prisma.order.findMany({
    where: {
      userId,
      status: "Pending",
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      orderShipping: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

export type Order = Awaited<ReturnType<typeof fetchOrders>>[number];
