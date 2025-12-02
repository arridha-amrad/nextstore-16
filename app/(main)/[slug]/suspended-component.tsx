import { formatToIDR } from "@/lib/utils";
import { ProductCarousel } from "./product-carousel";
import { fetchProductBySlug } from "./query";
import { Badge } from "@/components/ui/badge";

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
        <div className="flex items-center gap-4">
          <h2 className="font-bold mt-2 text-2xl">
            {formatToIDR(
              product.price - (product.price * product.discount) / 100
            )}
          </h2>
          {product.discount > 0 && (
            <div className="flex items-center gap-4">
              <h2 className="font-bold line-through text-foreground/30 mt-2 text-2xl">
                {formatToIDR(product.price)}
              </h2>
              <Badge className="mt-2" variant="destructive">
                {product.discount}% off
              </Badge>
            </div>
          )}
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
