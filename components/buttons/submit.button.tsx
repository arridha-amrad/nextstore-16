import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type Props = {
  isLoading: boolean;
  label: string;
};

export default function SubmitButton({ isLoading, label }: Props) {
  return (
    <Button disabled={isLoading} type="submit">
      {isLoading && <Spinner />}
      {label}
    </Button>
  );
}
