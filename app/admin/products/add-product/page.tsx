import AddProductForm from "@/components/forms/add-product.form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Nextstore | Add Product",
  description: "Add product performed by admin of nextstore",
};

export default function AddProductAdminPage() {
  return (
    <main className="px-4 lg:px-6">
      <AddProductForm />
    </main>
  );
}
