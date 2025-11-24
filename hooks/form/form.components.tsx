import { Button } from "@/components/ui/button";
import { useFormContext } from "./useFormHooks";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  label: string;
};
export function SubmitButton({ label }: Props) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && <Spinner />}
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}
