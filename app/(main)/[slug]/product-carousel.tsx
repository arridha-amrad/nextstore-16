"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

type Props = {
  images: string[];
};
export function ProductCarousel({ images }: Props) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((v, index) => (
          <CarouselItem key={index}>
            <Image
              className="object-cover w-full aspect-square"
              src={v}
              alt={v}
              width={500}
              height={500}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  );
}
