"use client";

import { ProductCarousel } from "./product-carousel";
import ProductDetail from "./product-details";
import { TProductDetail } from "./query";

export default function Product({ product }: { product: TProductDetail }) {
  return (
    <ProductDetail product={product}>
      <div className="flex-1">
        <ProductCarousel images={product.productImages.map((v) => v.url)} />
      </div>
      <div className="flex-2">
        <h1 className="text-2xl">{product.name}</h1>
        <ProductDetail.Price />
        <div className="flex items-center mt-4 gap-4">
          <ProductDetail.Counter />
          <ProductDetail.AddToCart />
        </div>
        <ProductDetail.Description />
      </div>
    </ProductDetail>
  );
}
