import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import SuspendedComponent from "./suspended-component";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = params.then((v) => v.slug);
  return (
    <main className="px-4 lg:px-6">
      <Suspense fallback={<Spinner />}>
        <SuspendedComponent slug={slug} />
      </Suspense>
    </main>
  );
}
