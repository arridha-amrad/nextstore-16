"use client";

import { TextareaField } from "@/components/input-field";
import StarRating from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { reviewProductAction } from "@/features/user/order/order-actions";
import { Order } from "@/features/user/order/order-queries";
import { formatToIDR, getAfterDiscountPrice, rgbaDataURL } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function ReviewDialog({ order }: { order: Order }) {
  const [value, setValue] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState({
    rating: "",
    comment: "",
  });

  const [comment, setComment] = useState("");

  useEffect(() => {
    return () => {
      setValue(0);
    };
  }, [open]);

  const { execute, isPending } = useAction(reviewProductAction, {
    onSuccess() {
      toast.success("Thank you for your review");
      setOpen(false);
    },
    onError({ error }) {
      console.log(error);
      if (error.validationErrors) {
        setError({
          ...error,
          comment: error.validationErrors.comment?.[0] ?? "",
          rating: error.validationErrors.rating?.[0] ?? "",
        });
      }
      toast.error("Something went wrong");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link">Review</Button>
      </DialogTrigger>
      <DialogOverlay className="backdrop-blur-sm" />
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Product Review</DialogTitle>
          <DialogDescription>
            Please write a review for the product
          </DialogDescription>
        </DialogHeader>
        <form action={execute}>
          {order.orderItems.map((item) => (
            <FieldGroup key={item.id} className="my-4">
              <div className="flex items-center gap-2">
                <div className="w-16 aspect-square">
                  <Image
                    width={100}
                    height={100}
                    placeholder="blur"
                    blurDataURL={rgbaDataURL(0, 0, 0, 0)}
                    src={item.product.productImages[0].url}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <p>{item.product.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-sm">
                      {item.quantity} x{" "}
                      {formatToIDR(
                        getAfterDiscountPrice(
                          item.priceAtOrder,
                          item.discountAtOrder
                        )
                      )}
                    </p>
                    <p className="line-through text-sm">
                      {formatToIDR(item.priceAtOrder)}
                    </p>
                    <Badge variant="destructive">
                      {item.discountAtOrder}% off
                    </Badge>
                  </div>
                </div>
              </div>
              <input hidden defaultValue={item.productId} name="productId" />
              <Field>
                <Label>Rating</Label>
                <input hidden value={value} readOnly name="rating" />
                <div className="flex items-center gap-2">
                  <StarRating value={value} onChange={setValue} />
                  {value !== 0 && (
                    <span className="text-muted-foreground">
                      (&nbsp;{value}&nbsp;/&nbsp;5)
                    </span>
                  )}
                </div>
                {error.rating && (
                  <p className="text-red-400 text-sm">{error.rating}</p>
                )}
              </Field>
              <TextareaField
                name="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                errorMessage={error.comment}
                label="Review"
                placeholder="Write your review"
              />
            </FieldGroup>
          ))}
          <div className="flex justify-end gap-2 mt-2">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending && <Spinner />}
              Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
