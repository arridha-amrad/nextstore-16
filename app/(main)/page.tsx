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

export default async function Page({ searchParams }: PageProps<"/">) {
  return (
    <main className="container mx-auto">
      <Suspense fallback={<Spinner />}>
        <Products searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
