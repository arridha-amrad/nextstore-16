import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const LIMIT = 20;

export const fetchProducts = async (page: number) => {
  "use cache";
  cacheTag(cacheKeys.products.user);
  const result = await prisma.product.findMany({
    take: LIMIT,
    skip: (page - 1) * LIMIT,
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      slug: true,
      discount: true,
      productImages: {
        select: {
          url: true,
        },
        take: 1,
      },
    },
  });
  return result;
};
