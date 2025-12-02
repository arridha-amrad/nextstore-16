import { SearchParamsProps } from "@/types";
import SuspendedComponent from "./suspended-component";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export default async function Page({ searchParams }: SearchParamsProps) {
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
    <main className="container mx-auto">
      <Suspense fallback={<Spinner />}>
        <SuspendedComponent page={page} />
      </Suspense>
    </main>
  );
}
