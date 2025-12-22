import ProductReviewCard from "@/components/cards/ProductReviewCard";
import { Star } from "lucide-react";
import { fetchProductReviews, TReview } from "../products-queries";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductReviews({ params }: Props) {
  const resolvedParams = await params;
  const reviews = await fetchProductReviews(resolvedParams.slug);

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <div className="my-4">
        <h1 className="text-2xl font-bold">Product Reviews</h1>
      </div>
      <div className="space-y-4">
        <RatingSummary reviews={reviews} />
        {reviews.map((review) => (
          <ProductReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}

function RatingSummary({ reviews }: { reviews: TReview[] }) {
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  return (
    <div className="w-lg mb-10">
      <div className="flex items-start gap-8">
        <div>
          <div className="flex items-center gap-2">
            <Star className="fill-primary size-7 stroke-primary" />
            <p className="font-bold text-2xl">
              {averageRating}
              <span className="text-foreground/70 text-base">/5.0</span>
            </p>
          </div>
          <div className="mt-2">
            <p className="text-sm text-foreground/70 text-center ">
              {reviews.length} reviews
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
