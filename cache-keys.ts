export const cacheKeys = {
  products: "products",
  product: (id: string) => `products-${id}`,
  productCategories: "productCategories",
};
