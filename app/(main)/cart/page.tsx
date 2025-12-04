import { Spinner } from "@/components/ui/spinner";
import { SearchParamsProps } from "@/types";
import { Suspense } from "react";
import { getPage } from "../utils-server";
import CartSuspendedComponent from "./suspended-component";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nextstore | Cart",
  description: "Nextstore by devari cart page",
};

export default async function UserCartPage({
  searchParams,
}: SearchParamsProps) {
  const page = getPage(searchParams);

  return (
    <Suspense fallback={<Spinner />}>
      <CartSuspendedComponent page={page} />
    </Suspense>
  );
}
