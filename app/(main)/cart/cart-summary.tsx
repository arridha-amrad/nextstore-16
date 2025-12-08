"use client";

import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from "react";
import { CartItem } from "./query";
import { Address, Shipping } from "@/app/api/shipping/types";
import { formatToIDR, getAfterDiscountPrice } from "@/lib/utils";
import { CourierDialog } from "./courier-dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { placeOrderAction } from "./action";
import toast from "react-hot-toast";

const CartSummaryContext = createContext<{
  items: CartItem[];
  shipping: Shipping | null;
  address: Address | null;
  setAddress: Dispatch<SetStateAction<Address | null>>;
  setShipping: Dispatch<SetStateAction<Shipping | null>>;
} | null>(null);

const useCartSummaryContext = () => {
  const ctx = useContext(CartSummaryContext);
  if (!ctx) {
    throw new Error("useCartSummaryContext must be used inside CartSummary");
  }
  return ctx;
};

function CartSummary({ items, children }: PropsWithChildren<{ items: CartItem[] }>) {
  const [address, setAddress] = useState<Address | null>(null);
  const [shipping, setShipping] = useState<Shipping | null>(null);
  return (
    <CartSummaryContext.Provider value={{ items, address, setAddress, shipping, setShipping }}>
      <div className="flex items-center justify-center gap-x-8">{children}</div>
    </CartSummaryContext.Provider>
  );
}

CartSummary.SubTotal = () => {
  const { items } = useCartSummaryContext();
  const subTotal = items
    .filter((item) => item.isSelected)
    .map((item) => item.quantity * getAfterDiscountPrice(item.product.price, item.product.discount))
    .reduce((cv, pv) => {
      pv += cv;
      return pv;
    }, 0);
  return (
    <div>
      <h1 className="font-bold">Subtotal</h1>
      <h2 className="font-bold text-2xl">
        <span className="text-base font-light">Rp.</span>
        {formatToIDR(subTotal).replace("Rp", "").trim()}
      </h2>
    </div>
  );
};

CartSummary.Shipping = () => {
  const { shipping, setAddress, setShipping, items } = useCartSummaryContext();
  const totalWeight = items.reduce((cv, pv) => {
    cv += pv.quantity * pv.product.weight;
    return cv;
  }, 0);

  return shipping ? (
    <div>
      <h1 className="font-bold">Shipping</h1>
      <h2 className="font-bold text-2xl">
        <span className="text-base font-light">Rp.</span>
        {formatToIDR(shipping.cost).replace("Rp", "").trim()}
      </h2>
    </div>
  ) : (
    <CourierDialog setShippingCallback={setShipping} setAddressCallback={setAddress} weight={totalWeight} />
  );
};

CartSummary.Total = () => {
  const { items, shipping } = useCartSummaryContext();
  const subTotal = items
    .filter((item) => item.isSelected)
    .map((item) => item.quantity * getAfterDiscountPrice(item.product.price, item.product.discount))
    .reduce((cv, pv) => {
      pv += cv;
      return pv;
    }, 0);
  return (
    <div>
      <h1 className="font-bold">Total</h1>
      <h2 className="font-bold text-2xl">
        <span className="text-base font-light">Rp.</span>
        {formatToIDR(subTotal + (shipping?.cost ?? 0))
          .replace("Rp", "")
          .trim()}
      </h2>
    </div>
  );
};

CartSummary.PlaceOrder = () => {
  const { address, shipping } = useCartSummaryContext();
  const router = useRouter();
  const placeOrder = async () => {
    if (!address || !shipping) return;
    const result = await placeOrderAction({ address, shipping });
    if (result.data) {
      toast.success("new order created", { duration: 3000 });
      router.push("/orders");
      return;
    }
    if (result.serverError) {
      toast.error("something went wrong", { duration: 3000 });
      return;
    }
  };
  return (
    <Button disabled={!shipping || !address} onClick={placeOrder} size="lg">
      <ShoppingCart />
      Place Order
    </Button>
  );
};

export default CartSummary;
