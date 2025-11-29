import { DataTable } from "@/components/data-table";
import { Spinner } from "@/components/ui/spinner";
import { fetchProductsForAdmin } from "@/queries/products/fetchProductForAdmin";
import { Metadata } from "next";
import { cacheTag } from "next/cache";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Admin Nextstore | Products",
  description: "List of product of nextstore",
};

const fetchProducts = async () => {
  "use cache";
  cacheTag("products");
  return fetchProductsForAdmin();
};

export default async function ProductsAdminPage() {
  const products = await fetchProducts();
  return (
    <>
      <Suspense fallback={<Spinner />}>
        <DataTable data={products} />
      </Suspense>
    </>
  );
}
