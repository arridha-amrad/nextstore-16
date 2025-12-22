import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

const LIMIT = 10;

type Params = {
  page: number;
  category?: string;
  name?: string;
};

export const fetchProducts = async ({ page, category, name }: Params) => {
  "use cache";
  cacheTag(cacheKeys.products.user);

  const totalRecords = await prisma.product.count({
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
  });

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

  return {
    data: result,
    total: totalRecords,
    itemsPerPage: LIMIT,
  };
};

export type Result = Awaited<ReturnType<typeof fetchProducts>>;
export type Product = Result["data"][number];

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

export const fetchProductReviews = async (slug: string) => {
  "use cache";
  cacheTag("product reviews", slug);

  const reviews = await prisma.productReview.findMany({
    where: {
      product: {
        slug,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return reviews;
};

export type TReview = Awaited<ReturnType<typeof fetchProductReviews>>[number];
