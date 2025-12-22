"use client";

import { TReview } from "@/features/user/product/products-queries";
import { rgbaDataURL } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import StarRating from "../star-rating";

export default function ProductReviewCard({ review }: { review: TReview }) {
  return (
    <article className="space-y-4 border border-foreground/10 p-4 rounded-md">
      <div className="flex items-center gap-4">
        <StarRating size={15} readOnly value={review.rating} />
        <p className="text-muted-foreground">
          {formatDistanceToNow(new Date(review.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Image
          src={review.user.image!}
          alt={review.user.name!}
          width={50}
          height={50}
          className="rounded-full"
          placeholder="blur"
          blurDataURL={rgbaDataURL(0, 0, 0, 0.2)}
        />
        <p className="font-bold">{review.user.name}</p>
      </div>
      <p>{review.comment}</p>
    </article>
  );
}
