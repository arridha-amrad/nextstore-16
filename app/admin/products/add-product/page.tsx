import AddProductForm from "@/components/forms/add-product.form";
import { Metadata } from "next";
import { getProductCategories } from "../query";

export const metadata: Metadata = {
  title: "Admin Nextstore | Add Product",
  description: "Add product performed by admin of nextstore",
};

export default async function AddProductAdminPage() {
  const categories = await getProductCategories();
  return (
    <main className="px-4 lg:px-6">
      <AddProductForm categories={categories} />
    </main>
  );
}
