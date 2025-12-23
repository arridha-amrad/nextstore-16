import OrderItemCardSkeleton from "@/components/cards/OrderItemCard.Skeleton";
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
        <OrderItemCardSkeleton key={index} />
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
