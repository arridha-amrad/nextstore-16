import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { ProductModel } from "@/models/product.model";
import { cacheTag } from "next/cache";
import TableProducts from "./table-products";

const LIMIT = 10;

const fetchProducts = async (page: number) => {
  "use cache";
  cacheTag(cacheKeys.products.admin);

  const result = await prisma.product.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    take: LIMIT,
    skip: (page - 1) * LIMIT,
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
    description: {
      html: v.descriptionHtml,
      json: v.descriptionJson,
    },
    images: v.productImages.map((img) => img.url),
  }));

  return final;
};

export default async function AdminProductsSuspenseComponent({
  pPage,
}: {
  pPage: Promise<number>;
}) {
  const page = await pPage;
  const products = await fetchProducts(page);
  const totalProducts = await prisma.product.count();
  return (
    <TableProducts
      productsPerPage={LIMIT}
      totalProduct={totalProducts}
      products={products}
    />
  );
}
