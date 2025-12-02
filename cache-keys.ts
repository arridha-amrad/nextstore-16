export const cacheKeys = {
  products: {
    user: "user-products",
    admin: "admin-products",
  },
  product: {
    user: (id: string) => `user-product-${id}`,
    admin: (id: string) => `admin-product-${id}`,
  },
  productCategories: "productCategories",
};
