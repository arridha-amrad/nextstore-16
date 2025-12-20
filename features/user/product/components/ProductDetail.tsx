import { fetchProductBySlug } from "../products-queries";
import Product from "@/components/ProductDetail";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetail({ params }: Props) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return <p>Product Not Found</p>;
  }

  return <Product product={product} />;
}
