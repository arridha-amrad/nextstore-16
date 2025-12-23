import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function OrderItemCardSkeleton() {
  return (
    <Card className="flex-1">
      <CardContent className="flex items-start gap-4">
        <Skeleton className="w-5 aspect-square rounded-full" />
        <Skeleton className="w-24 aspect-square rounded-full" />
        <div className="mt-1 space-y-2 w-full">
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-full h-5" />
        </div>
      </CardContent>
    </Card>
  );
}
