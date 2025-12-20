import { Spinner } from "@/components/ui/spinner";
import ProductDetail from "@/features/user/product/components/ProductDetail";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const slug = (await params).slug;
  return {
    title: slug,
  };
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/[slug]">) {
  return (
    <Suspense fallback={<Spinner />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}
