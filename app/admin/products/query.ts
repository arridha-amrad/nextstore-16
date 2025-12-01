import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { ProductModel } from "@/models/product.model";
import { cacheTag } from "next/cache";

export const getProductCategories = async () => {
  "use cache";
  cacheTag(cacheKeys.productCategories);
  return prisma.productCategory.findMany({ orderBy: { title: "asc" } });
};

export const fetchProductById = async (id: string) => {
  "use cache";
  cacheTag(cacheKeys.product(id));
  const result = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: {
        select: {
          id: true,
          title: true,
        },
      },
      productImages: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });
  if (!result) return null;
  const final: ProductModel = {
    id: result.id,
    name: result.name,
    slug: result.slug,
    category: result.category?.title ?? "",
    description: {
      html: result.descriptionHtml,
      json: result.descriptionJson ?? "",
    },
    discount: result.discount,
    images: result.productImages.map((v) => v.url),
    price: result.price,
    stock: result.stock,
  };
  return final;
};
