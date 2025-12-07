"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatToIDR, getAfterDiscountPrice } from "@/lib/utils";
import { ShoppingCart, Truck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { CartItem } from "./query";
import { placeOrderAction } from "./action";
import { useRouter } from "nextjs-toploader/app";
import { CourierDialog } from "./courier-dialog";

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

  const [postalCode, setPostalCode] = useState("");

  const getLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("your browser doesn't support geolocation");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        const res = await fetch(url, {
          headers: {
            "User-Agent": "nextstore by devari",
          },
        });
        const data = await res.json();
        const code = data.address.postcode;
        setPostalCode(code);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const router = useRouter();

  const placeOrder = async () => {
    const result = await placeOrderAction();
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
    <Sheet modal={false} open>
      <SheetContent side="bottom">
        <SheetHeader className="flex items-center justify-center">
          <SheetTitle className="sr-only">Subtotal</SheetTitle>
          <div className="flex items-center gap-8">
            <div>
              <h1 className="font-bold">Subtotal</h1>
              <h2 className="font-bold text-2xl">
                <span className="text-base font-light">Rp.</span>
                {formatToIDR(total).replace("Rp", "").trim()}
              </h2>
            </div>
            <div>
              <CourierDialog />
              {/* <h1 className="font-bold">Shipping Cost</h1>
              <h2 className="font-bold text-2xl">
                <span className="text-base font-light">Rp.</span>
                {formatToIDR(total).replace("Rp", "").trim()}
              </h2> */}
            </div>
            {/* <h1>{postalCode}</h1> */}
            {/* <Button onClick={getLocation}>Get Location</Button> */}
            <Button disabled onClick={placeOrder} size="lg">
              <ShoppingCart />
              Place Order
            </Button>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
