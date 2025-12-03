import { Spinner } from "@/components/ui/spinner";
import { Metadata } from "next";
import { Suspense } from "react";
import SuspendedComponent from "./suspended-component";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  return {
    title: slug,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const slug = params.then((v) => v.slug);
  return (
    <Suspense fallback={<Spinner />}>
      <SuspendedComponent slug={slug} />
    </Suspense>
  );
}
