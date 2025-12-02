import { formatToIDR } from "@/lib/utils";
import { ProductCarousel } from "./product-carousel";
import { AddToCartButton, Quantity } from "./product-details";
import { fetchProductBySlug } from "./query";

export default async function SuspendedComponent({
  slug,
}: {
  slug: Promise<string>;
}) {
  const s = await slug;
  const product = await fetchProductBySlug(s);
  if (!product) {
    return <p>Product not found</p>;
  }
  return (
    <div className="flex items-start gap-6">
      <div className="flex-1">
        <ProductCarousel images={product.productImages.map((v) => v.url)} />
      </div>
      <div className="flex-2">
        <h1 className="text-2xl">{product.name}</h1>
        <div className="flex items-center gap-4 mt-4">
          <h2 className="font-bold text-2xl">
            {formatToIDR(
              product.price - (product.price * product.discount) / 100
            )}
          </h2>
          {product.discount > 0 && (
            <div className="flex items-center gap-x-4">
              <h2 className="font-bold line-through text-foreground/30 text-2xl">
                {formatToIDR(product.price)}
              </h2>
              <h2 className="font-bold text-destructive">
                {product.discount}%
              </h2>
            </div>
          )}
        </div>
        <div className="flex items-center mt-4 gap-4">
          <Quantity />
          <AddToCartButton />
        </div>
        {product.descriptionHtml && (
          <div
            className="mt-4"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        )}
      </div>
    </div>
  );
}
