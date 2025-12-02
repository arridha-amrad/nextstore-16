import { ProductModel } from "@/models/product.model";
import { cacheTag } from "next/cache";
import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import EditProductForm from "@/app/admin/products/[id]/edit-product.form.";
import { fetchCategories } from "../query";

const fetchProductById = async (id: string) => {
  "use cache";
  cacheTag(cacheKeys.product.admin(id));

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

export default async function SuspendedComponent({
  productId,
}: {
  productId: Promise<string>;
}) {
  const pId = await productId;
  const product = await fetchProductById(pId);
  const categories = await fetchCategories();

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <main className="px-4 lg:px-6">
      <EditProductForm categories={categories} product={product} />
    </main>
  );
}
