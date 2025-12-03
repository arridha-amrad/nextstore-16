import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const LIMIT = 20;

type Params = {
  page: number;
  category?: string;
  name?: string;
};

export const fetchProducts = async ({ page, category, name }: Params) => {
  "use cache";
  cacheTag(cacheKeys.products.user);

  const result = await prisma.product.findMany({
    take: LIMIT,
    skip: (page - 1) * LIMIT,
    orderBy: {
      updatedAt: "desc",
    },
    where: {
      ...(category && {
        category: {
          title: category,
        },
      }),
      ...(name && {
        name: {
          mode: "insensitive",
          contains: name,
        },
      }),
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      slug: true,
      discount: true,
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
  });
  console.log(result.map((c) => c.name));

  return result;
};
