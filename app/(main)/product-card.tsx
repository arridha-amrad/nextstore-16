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
    <Card
      className="pt-0 overflow-hidden"
      onClick={() => router.push(`/${product.slug}`)}
    >
      <CardContent className="space-y-2 p-0">
        <div className="w-full aspect-square">
          <Image
            className="object-cover aspect-square object-center"
            alt={product.name}
            src={product.productImages[0].url}
            height={400}
            width={400}
          />
        </div>
        <div className="p-4 space-y-4">
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
        </div>
      </CardContent>
    </Card>
  );
}
