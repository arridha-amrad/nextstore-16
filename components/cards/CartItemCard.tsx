"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { formatToIDR, getAfterDiscountPrice } from "@/lib/utils";
import { MinusIcon, PlusIcon, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  decreaseQuantityAction,
  deleteCartItemAction,
  increaseQuantityAction,
  toggleCheck,
} from "@/features/user/cart/cart-actions";
import { CartItem } from "@/features/user/cart/cart-queries";

type Props = {
  item: CartItem;
};
export default function CartItemCard({ item }: Props) {
  const updateCheck = async () => {
    await toggleCheck({ id: item.id });
  };

  return (
    <Card>
      <CardContent className="flex items-start gap-4">
        <Checkbox checked={item.isSelected} onCheckedChange={updateCheck} />
        <Image
          src={item.product.productImages[0].url}
          alt={item.product.name}
          width={100}
          height={100}
          className="object-cover aspect-square"
        />
        <div className="mt-1 space-y-2">
          <Link className="line-clamp-1" href={`/${item.product.slug}`}>
            {item.product.name}
          </Link>
          <div className="flex mt-2 items-center gap-4">
            <p>
              {formatToIDR(
                getAfterDiscountPrice(item.product.price, item.product.discount)
              )}
            </p>
            <p className="line-through text-foreground/50">
              {formatToIDR(item.product.price)}
            </p>
            <Badge variant={"destructive"}>{item.product.discount}%</Badge>
          </div>

          <p className="text-sm text-foreground/50">
            <span className="">Stock</span> <span>{item.product.stock}</span>
          </p>
          <div className="flex items-center gap-4">
            <ButtonGroup orientation="horizontal" className="h-fit">
              <Button
                onClick={async () => {
                  if (item.quantity > 1) {
                    await decreaseQuantityAction({
                      id: item.id,
                      currQuantity: item.quantity,
                    });
                  }
                }}
                variant="outline"
                size="icon"
              >
                <MinusIcon />
              </Button>
              <Button variant="outline">{item.quantity}</Button>
              <Button
                onClick={async () =>
                  await increaseQuantityAction({
                    id: item.id,
                    currQuantity: item.quantity,
                  })
                }
                variant="outline"
                size="icon"
              >
                <PlusIcon />
              </Button>
            </ButtonGroup>
            <DeleteButton id={item.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const DeleteButton = ({ id }: { id: string }) => {
  return (
    <Button
      onClick={async () => {
        await deleteCartItemAction({ id });
      }}
      title="Delete from cart"
      variant={"ghost"}
      size={"icon"}
    >
      <Trash className="stroke-red-500" />
    </Button>
  );
};
