import ProductCard from "@/components/cards/ProductCard";
import { fetchProducts } from "../products-queries";
import PaginationButtons from "@/components/PaginationButtons";

type SearchParams = {
  page?: string;
  search?: string;
  category?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function ProductList({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const { page, search, category } = resolvedSearchParams;

  const products = await fetchProducts({
    page: page ? parseInt(page) : 1,
    category,
    name: search,
  });

  if (products.data.length === 0) {
    return <p>No products found</p>;
  }

  return (
    <>
      <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-4">
        {products.data.map((p) => (
          <ProductCard product={p} key={p.id} />
        ))}
      </div>
      <div className="mt-8">
        <PaginationButtons
          itemsPerPage={products.itemsPerPage}
          totalRecords={products.total}
        />
      </div>
    </>
  );
}
