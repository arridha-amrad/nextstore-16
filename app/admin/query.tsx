import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

export const fetchOrders = async () => {
  "use cache";
  cacheTag(cacheKeys.orders.admin);

  const orders = await prisma.order.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
};

export type Order = Awaited<ReturnType<typeof fetchOrders>>[number];
