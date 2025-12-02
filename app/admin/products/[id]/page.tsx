import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import SuspendedComponent from "./suspended-component";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Nextstore | Edit Products",
  description: "Edit product page for admin",
};

export default async function AdminProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const productId = params.then((p) => p.id);
  return (
    <Suspense
      fallback={
        <div className="py-4 flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <SuspendedComponent productId={productId} />
    </Suspense>
  );
}
