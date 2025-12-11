"use client";

import { rgbaDataURL } from "@/lib/utils";
import ProductDetailContext from "./product-context";
import { TProductDetail } from "./query";
import Image from "next/image";

export default function ProductDetail({
  product,
}: {
  product: TProductDetail;
}) {
  return (
    <ProductDetailContext product={product}>
      <div className="flex-1 flex items-start">
        {/* <ProductDetailContext.Carousel
          images={product.productImages.map((v) => v.url)}
        /> */}
        <div className="flex flex-col w-16 gap-y-2">
          {product.productImages.map((v, index) => (
            <div
              key={index}
              className="border aspect-square border-input rounded-md"
            >
              <Image
                placeholder="blur"
                blurDataURL={rgbaDataURL(0, 0, 0, 0)}
                src={v.url}
                alt={v.url}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="flex-1"></div>
      </div>
      <div className="flex-2">
        <h1 className="text-2xl">{product.name}</h1>
        <ProductDetailContext.Price />
        <div className="flex items-center mt-4 gap-4">
          <ProductDetailContext.Counter />
          <ProductDetailContext.AddToCart />
        </div>
        <ProductDetailContext.Description />
      </div>
    </ProductDetailContext>
  );
}
