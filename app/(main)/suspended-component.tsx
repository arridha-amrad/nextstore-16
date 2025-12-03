import ProductCard from "./product-card";
import { fetchProducts } from "./query";

export default async function SuspendedComponent({
  page,
  category,
  productName,
}: {
  page: Promise<number>;
  category: Promise<string>;
  productName: Promise<string>;
}) {
  const intPage = await page;
  const cat = await category;
  const name = await productName;

  const products = await fetchProducts({ page: intPage, category: cat, name });

  if (products.length === 0) {
    return <p>product not found</p>;
  }

  return (
    <div className="grid grid-cols-5 gap-4">
      {products.map((p) => (
        <ProductCard product={p} key={p.id} />
      ))}
    </div>
  );
}
