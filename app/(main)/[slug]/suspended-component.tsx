import Product from "./product-detail";
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
  return <Product product={product} />;
}
