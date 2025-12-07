import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

export const fetchProductBySlug = async (slug: string) => {
  "use cache";
  cacheTag(cacheKeys.product.slug(slug));

  return prisma.product.findUnique({
    where: {
      slug,
    },
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
      },
    },
  });
};

export type TProductDetail = NonNullable<
  Awaited<ReturnType<typeof fetchProductBySlug>>
>;
