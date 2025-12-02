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
    <Suspense fallback={<Spinner />}>
      <SuspendedComponent slug={slug} />
    </Suspense>
  );
}
