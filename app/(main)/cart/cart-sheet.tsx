"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import CartSummary from "./cart-summary";
import { CartItem } from "./query";

type Props = {
  items: CartItem[];
};

export default function CartSheet({ items }: Props) {
  return (
    <Sheet modal={false} open>
      <SheetContent className="py-4" side="bottom">
        <SheetHeader className="flex sr-only items-center justify-center">
          <SheetTitle>Subtotal</SheetTitle>
          <SheetDescription>Your cart summary</SheetDescription>
        </SheetHeader>
        <CartSummary items={items}>
          <CartSummary.SubTotal />
          <CartSummary.Shipping />
          <CartSummary.Total />
          <CartSummary.PlaceOrder />
        </CartSummary>
      </SheetContent>
    </Sheet>
  );
}
