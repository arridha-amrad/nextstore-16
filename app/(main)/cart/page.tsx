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
    <div className="flex items-center gap-4 flex-wrap">
      {[...Array(3)].map((_, index) => (
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
}

export default async function UserCartPage({
  searchParams,
}: PageProps<"/cart">) {

  return (
    <Suspense fallback={<SkeletonUI />}>
      <CartItemList searchParams={searchParams} />
    </Suspense>
  );
}
