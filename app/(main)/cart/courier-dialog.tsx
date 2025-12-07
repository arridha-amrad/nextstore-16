"use client";

import { InputField } from "@/components/input-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";

export function CourierDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Truck />
          Pick Courier
        </Button>
      </DialogTrigger>
      <DialogOverlay className="backdrop-blur" />
      <DialogContent className="sm:max-w-md relative z-999">
        <DialogHeader>
          <DialogTitle>Choose Courier</DialogTitle>
          <DialogDescription>
            This courier will deliver your package
          </DialogDescription>
        </DialogHeader>
        <form>
          <FieldGroup>
            <InputField label="Province" placeholder="DKI Jakarta" />
          </FieldGroup>
        </form>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
