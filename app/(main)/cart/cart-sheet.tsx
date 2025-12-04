"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatToIDR, getAfterDiscountPrice } from "@/lib/utils";
import { WalletCardsIcon } from "lucide-react";
import { CartItem } from "./query";

type Props = {
  items: CartItem[];
};

export default function CartSheet({ items }: Props) {
  const total = items
    .filter((item) => item.isSelected)
    .map(
      (item) =>
        item.quantity *
        getAfterDiscountPrice(item.product.price, item.product.discount)
    )
    .reduce((cv, pv) => {
      pv += cv;
      return pv;
    }, 0);
  return (
    <Sheet modal={false} open>
      <SheetContent side="bottom">
        <SheetHeader className="flex items-center justify-center">
          <SheetTitle className="sr-only">Total</SheetTitle>
          <div className="flex items-center gap-8">
            <div>
              <h1 className="font-bold">Total</h1>
              <h2 className="font-bold text-2xl">
                <span className="text-base font-light">Rp.</span>
                {formatToIDR(total).replace("Rp", "").trim()}
              </h2>
            </div>
            <Button size="lg">
              <WalletCardsIcon />
              Pay
            </Button>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
