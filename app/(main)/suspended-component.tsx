import ProductCard from "./product-card";
import { fetchProducts } from "./query";

export default async function SuspendedComponent({
  page,
}: {
  page: Promise<number>;
}) {
  const intPage = await page;
  const products = await fetchProducts(intPage);

  return (
    <div className="grid grid-cols-5 gap-4">
      {products.map((p) => (
        <ProductCard product={p} key={p.id} />
      ))}
    </div>
  );
}
