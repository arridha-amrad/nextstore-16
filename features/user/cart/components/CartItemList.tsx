import CartItemCard from "@/components/cards/CartItemCard";
import { fetchCart } from "../cart-queries";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import CartSheet from "@/components/CartSummarySheet";
import PaginationButtons from "@/components/PaginationButtons";

type SearchParams = {
  page?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function CartItemList({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const { page } = resolvedSearchParams;

  const session = await getServerSession();
  if (!session) {
    redirect("/auth/signin?callbackUrl=/cart");
  }

  const { cart, itemsPerPage, total } = await fetchCart({
    userId: session.user.id,
    page: page ? parseInt(page) : 1,
  });

  if (!cart || cart.cartItems.length === 0) {
    return <p>cart is empty</p>;
  }

  return (
    <>
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4">
        {cart?.cartItems.map((item) => (
          <CartItemCard key={item.id} item={item} />
        ))}
      </div>
      <div className="mt-8">
        <PaginationButtons itemsPerPage={itemsPerPage} totalRecords={total} />
      </div>
      <CartSheet items={cart.cartItems} />
    </>
  );
}
