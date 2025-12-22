import { TextareaField } from "@/components/InputField";
import StarRating from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { rgbaDataURL, formatToIDR, getAfterDiscountPrice } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { reviewProductAction } from "../order-actions";
import { Order } from "../order-queries";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CreateReview({
  orderItem,
  callback,
}: {
  orderItem: Order["orderItems"][number];
  callback: () => void;
}) {
  const { execute, isPending } = useAction(reviewProductAction, {
    onSuccess() {
      toast.success("Thank you for your review");
      callback();
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

  const [ratingvalue, setRatingValue] = useState(0);
  const [error, setError] = useState({
    rating: "",
    comment: "",
  });

  const [comment, setComment] = useState("");

  return (
    <form action={execute}>
      <ProductCard orderItem={orderItem} />
      <FieldGroup key={orderItem.id} className="my-4">
        <input hidden defaultValue={orderItem.productId} name="productId" />
        <input hidden defaultValue={orderItem.id} name="orderItemId" />
        <Field>
          <Label>Rating</Label>
          <input hidden value={ratingvalue} readOnly name="rating" />
          <div className="flex items-center gap-2">
            <StarRating value={ratingvalue} onChange={setRatingValue} />
            {ratingvalue !== 0 && (
              <span className="text-muted-foreground">
                (&nbsp;{ratingvalue}&nbsp;/&nbsp;5)
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

      <div className="flex justify-end gap-2 mt-2">
        <Button type="button" onClick={callback} variant="outline">
          Cancel
        </Button>
        <Button disabled={isPending} type="submit">
          {isPending && <Spinner />}
          Save changes
        </Button>
      </div>
    </form>
  );
}

const ProductCard = ({
  orderItem,
}: {
  orderItem: Order["orderItems"][number];
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 aspect-square">
        <Image
          width={100}
          height={100}
          placeholder="blur"
          blurDataURL={rgbaDataURL(0, 0, 0, 0)}
          src={orderItem.product.productImages[0].url}
          alt={orderItem.product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-1">
        <p>{orderItem.product.name}</p>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">
            {orderItem.quantity} x{" "}
            {formatToIDR(
              getAfterDiscountPrice(
                orderItem.priceAtOrder,
                orderItem.discountAtOrder
              )
            )}
          </p>
          <p className="line-through text-sm">
            {formatToIDR(orderItem.priceAtOrder)}
          </p>
          <Badge variant="destructive">{orderItem.discountAtOrder}% off</Badge>
        </div>
      </div>
    </div>
  );
};
