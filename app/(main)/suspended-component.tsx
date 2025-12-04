import ActiveFilter from "./activeFilter";
import { PaginationProducts } from "./pagination-products";
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

  const { data, itemsPerPage, total } = await fetchProducts({
    page: intPage,
    category: cat,
    name,
  });

  if (data.length === 0) {
    return <p>product not found</p>;
  }

  return (
    <>
      <>
        <ActiveFilter />
        <div className="grid grid-cols-5 gap-4">
          {data.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>
      </>
      <div className="mt-8">
        <PaginationProducts itemsPerPage={itemsPerPage} totalRecords={total} />
      </div>
    </>
  );
}
