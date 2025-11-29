import { cacheKeys } from "@/cache-keys";
import AddProductForm from "@/components/forms/add-product.form";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { cacheTag } from "next/cache";

export const metadata: Metadata = {
  title: "Admin Nextstore | Add Product",
  description: "Add product performed by admin of nextstore",
};

const getProductCategories = async () => {
  "use cache";
  cacheTag(cacheKeys.productCategories);
  return prisma.productCategory.findMany({ orderBy: { title: "asc" } });
};

export default async function AddProductAdminPage() {
  const categories = await getProductCategories();
  return (
    <main className="px-4 lg:px-6">
      <AddProductForm categories={categories} />
    </main>
  );
}
