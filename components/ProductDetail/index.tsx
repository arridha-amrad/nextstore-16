"use client";

import { cn, rgbaDataURL } from "@/lib/utils";
import ProductDetailContext from "./ProductDetailContext";
import Image from "next/image";
import { useState } from "react";
import { TProductDetail } from "@/features/product/products-queries";

export default function ProductDetail({
  product,
}: {
  product: TProductDetail;
}) {
  return (
    <ProductDetailContext product={product}>
      <ProductImage images={product.productImages.map((v) => v.url)} />
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

const ProductImage = ({ images }: { images: string[] }) => {
  const [currentImage, setCurrentImage] = useState(0);
  return (
    <div className="flex-1 flex items-start gap-4">
      <div className="flex flex-col w-16 gap-y-2">
        {images.map((v, index) => (
          <div
            key={index}
            className={cn(
              "aspect-square rounded-md",
              currentImage === index ? "ring-input ring-2" : ""
            )}
            onClick={() => setCurrentImage(index)}
          >
            <Image
              placeholder="blur"
              blurDataURL={rgbaDataURL(0, 0, 0, 0)}
              src={v}
              alt={v}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="flex-1 border border-input rounded-md aspect-square">
        <Image
          className="w-full h-full object-cover"
          src={images[currentImage]}
          alt={images[currentImage]}
          width={500}
          height={500}
          placeholder="blur"
          blurDataURL={rgbaDataURL(0, 0, 0, 0)}
        />
      </div>
    </div>
  );
};
