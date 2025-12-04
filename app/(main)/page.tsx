import { SearchParamsProps } from "@/types";
import SuspendedComponent from "./suspended-component";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Metadata } from "next";
import { getPage } from "./utils-server";

const getCategory = (searchParams: SearchParamsProps["searchParams"]) => {
  return searchParams.then((sp) => sp.category ?? "") as Promise<string>;
};

const getName = (searchParams: SearchParamsProps["searchParams"]) => {
  return searchParams.then((sp) => sp.search ?? "") as Promise<string>;
};

export async function generateMetadata({
  searchParams,
}: SearchParamsProps): Promise<Metadata> {
  const page = await getPage(searchParams);
  const category = await getCategory(searchParams);
  const name = await getName(searchParams);

  let title = "All products";
  if (category !== "") {
    title = `Products with category ${category}`;
  }

  if (name !== "") {
    title = `Products with name ${name}`;
  }

  if (page > 1) {
    title += ` page of ${page}`;
  }

  return {
    title,
  };
}

export default async function Page({ searchParams }: SearchParamsProps) {
  const name = getName(searchParams);
  const page = getPage(searchParams);
  const category = getCategory(searchParams);

  return (
    <main className="container mx-auto">
      <Suspense fallback={<Spinner />}>
        <SuspendedComponent
          productName={name}
          category={category}
          page={page}
        />
      </Suspense>
    </main>
  );
}
