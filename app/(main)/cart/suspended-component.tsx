import { getServerSession } from "@/lib/auth";
import { fetchCart } from "./query";
import { redirect } from "next/navigation";
import CartCard from "./cart-card";
import CartSheet from "./cart-sheet";

export default async function CartSuspendedComponent({
  page,
}: {
  page: Promise<number>;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin?callbackUrl=/cart");
  }

  const intPage = await page;

  const { cart } = await fetchCart({ userId: session.user.id, page: intPage });

  if (!cart || cart.cartItems.length === 0) {
    return <p>cart is empty</p>;
  }

  return (
    <div className="flex gap-4 flex-wrap">
      {cart?.cartItems.map((item) => (
        <CartCard key={item.id} item={item} />
      ))}
      <CartSheet items={cart.cartItems} />
    </div>
  );
}
