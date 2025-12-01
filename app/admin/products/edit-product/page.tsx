import { Spinner } from "@/components/ui/spinner";
import { SearchParamsProps } from "@/types";
import { Suspense } from "react";
import WrapperEditProduct from "./wrapper.edit-product";

export default async function EditProductAdminPage({
  searchParams,
}: SearchParamsProps) {
  const pId = searchParams.then((sp) => sp.id as string);

  return (
    <main className="px-4 lg:px-6">
      <Suspense fallback={<Spinner />}>
        <WrapperEditProduct productId={pId} />
      </Suspense>
    </main>
  );
}
