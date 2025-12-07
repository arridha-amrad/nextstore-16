export const cacheKeys = {
  products: {
    user: "user-products",
    admin: "admin-products",
  },
  product: {
    user: (id: string) => `user-product-${id}`,
    admin: (id: string) => `admin-product-${id}`,
    slug: (slug: string) => `product-by-${slug}`,
  },
  productCategories: "productCategories",
  carts: "carts",
  orders: {
    pending: "pending-orders",
  },
};
