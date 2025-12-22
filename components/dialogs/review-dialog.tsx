"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateReview from "@/features/user/order/components/CreateReview";
import { Order } from "@/features/user/order/order-queries";

type Props = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  orderItem: Order["orderItems"][number];
};

export function ReviewDialog({ isOpen, setOpen, orderItem }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link">Review</Button>
      </DialogTrigger>
      <DialogOverlay className="backdrop-blur-sm" />
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Product Review</DialogTitle>
          <DialogDescription>
            Please write a review for the product
          </DialogDescription>
        </DialogHeader>
        <CreateReview orderItem={orderItem} callback={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
