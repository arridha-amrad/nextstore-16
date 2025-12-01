import EditProductForm from "@/components/forms/edit-product.form.";
import { fetchProductById, getProductCategories } from "../query";

export default async function WrapperEditProduct({
  productId,
}: {
  productId: Promise<string>;
}) {
  const pId = await productId;
  const categories = await getProductCategories();
  const product = await fetchProductById(pId);

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <EditProductForm key={pId} categories={categories} product={product} />
  );
}
