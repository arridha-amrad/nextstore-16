import { SearchParamsProps } from "@/types";
import { Metadata } from "next";
import { Suspense } from "react";
import AdminProductsSuspenseComponent from "./suspensed-component";

export const metadata: Metadata = {
  title: "Admin Nextstore | Products",
  description: "List of product of nextstore",
};

export default async function ProductsAdminPage({
  searchParams,
}: SearchParamsProps) {
  const page = searchParams.then((sp) => {
    if (typeof sp.page !== "string") {
      return 1;
    }
    const pageNumber = parseInt(sp.page);
    if (isNaN(pageNumber)) {
      return 1;
    }
    return pageNumber;
  }) as Promise<number>;

  return (
    <main className="px-4 lg:px-6">
      <Suspense>
        <AdminProductsSuspenseComponent pPage={page} />
      </Suspense>
    </main>
  );
}
