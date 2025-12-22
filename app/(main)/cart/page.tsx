import CartSummarySheet from "@/components/CartSummarySheet";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CartItemList from "@/features/user/cart/components/CartItemList";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Nextstore | Cart",
  description: "Nextstore by devari cart page",
};

const SkeletonUI = () => {
  return (
    <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4">
      {[...Array(9)].map((_, index) => (
        <Card className="flex-1" key={index}>
          <CardContent className="flex items-start gap-4">
            <Skeleton className="w-5 aspect-square rounded-full" />
            <Skeleton className="w-24 aspect-square rounded-full" />
            <div className="mt-1 space-y-2 w-full">
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-full h-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default async function UserCartPage({
  searchParams,
}: PageProps<"/cart">) {
  return (
    <div className="relative">
      <Suspense fallback={<SkeletonUI />}>
        <CartItemList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
