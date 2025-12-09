import { InputField, TextareaField } from "@/components/input-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";

export function ReviewDialog() {
  return (
    <Dialog>
      <form>
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
          <FieldGroup>
            <InputField
              label="Rating"
              type="number"
              placeholder="1-5"
              step={0.5}
              min={1}
              max={5}
            />
            <TextareaField label="Review" placeholder="Write your review" />
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
