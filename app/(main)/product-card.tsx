"use client";

import { Card, CardContent } from "@/components/ui/card";
import { fetchProducts } from "./query";
import Image from "next/image";
import { formatToIDR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "nextjs-toploader/app";

type Props = {
  product: Awaited<ReturnType<typeof fetchProducts>>[number];
};
export default function ProductCard({ product }: Props) {
  const router = useRouter();
  return (
    <Card onClick={() => router.push(`/${product.slug}`)}>
      <CardContent className="space-y-2">
        <Image
          className="w-full aspect-square object-cover object-center"
          alt={product.name}
          src={product.productImages[0].url}
          height={400}
          width={400}
        />
        <h1 className="line-clamp-2">{product.name}</h1>
        {product.discount > 0 && (
          <div className="flex items-center gap-2">
            <p className="line-through font-light text-foreground/50">
              {formatToIDR(product.price)}
            </p>
            <Badge variant={"destructive"}>{product.discount}% off</Badge>
          </div>
        )}
        <p>
          {formatToIDR(
            product.price - (product.price * product.discount) / 100
          )}
        </p>
      </CardContent>
    </Card>
  );
}
