import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="pt-0 overflow-hidden select-none ">
      <CardContent className="space-y-2 p-0">
        <div className="w-full border-b aspect-square">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="px-4 mt-4 space-y-4">
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-full h-5" />
        </div>
      </CardContent>
    </Card>
  );
}
