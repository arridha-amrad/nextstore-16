import { ProductModel } from "@/models/product.model";
import prisma from "@/lib/prisma";

export const fetchProductsForAdmin = async () => {
  const result = await prisma.product.findMany({
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
  const final: ProductModel[] = result.map((v) => ({
    id: v.id,
    name: v.name,
    slug: v.slug,
    category: v.category?.title ?? "",
    price: v.price,
    stock: v.stock,
    discount: v.discount,
    description: v.description ?? "",
    images: v.productImages.map((img) => img.url),
  }));
  return final;
};
