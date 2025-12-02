import prisma from "@/lib/prisma";

export const fetchProductBySlug = async (slug: string) => {
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
