import ProductCardSkeleton from "@/components/cards/ProductCard.Skeleton";
import { Spinner } from "@/components/ui/spinner";
import Products from "@/features/user/product/components/ProductList";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
  searchParams,
}: PageProps<"/">): Promise<Metadata> {
  const page = await searchParams.then((sp) => sp.page ?? "1");
  const category = await searchParams.then((sp) => sp.category ?? "");
  const name = await searchParams.then((sp) => sp.search ?? "");
  let title = "All products";
  if (category !== "") {
    title = `Products with category ${category}`;
  }
  if (name !== "") {
    title = `Products with name ${name}`;
  }
  if (Number(page) > 1) {
    title += ` page of ${page}`;
  }
  return {
    title,
  };
}

export async function generateStaticParams() {
  return [
    {
      searchParams: {
        page: "1",
      },
    },
  ];
}

const SkeletonUI = () => {
  return (
    <div className="grid xl:grid-cols-5 lg:grid-cols-3 grid-cols-1 gap-4">
      {[...Array(10)].map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default async function Page({ searchParams }: PageProps<"/">) {
  return (
    <main className="container mx-auto">
      <Suspense fallback={<SkeletonUI />}>
        <Products searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
