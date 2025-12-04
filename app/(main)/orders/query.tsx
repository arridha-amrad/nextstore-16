import prisma from "@/lib/prisma";

type Params = {
  userId: string;
};
export const fetchOrders = async ({ userId }: Params) => {
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

export type Order = Awaited<ReturnType<typeof fetchOrders>>[number];
