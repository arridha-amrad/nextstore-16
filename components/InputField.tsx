import { InputHTMLAttributes, TextareaHTMLAttributes, useId } from "react";
import { FieldLabel, FieldError, FieldDescription, Field } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type Props = {
  label: string;
  description?: string;
  errorMessage?: string;
} & InputHTMLAttributes<HTMLInputElement>;
export function InputField({
  label,
  description,
  errorMessage,
  ...props
}: Props) {
  const id = useId();
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} {...props} />
      <FieldError
        errors={[
          {
            message: errorMessage?.includes(
              "expected string, received undefined"
            )
              ? "required"
              : errorMessage,
          },
        ]}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}

export function TextareaField({
  label,
  description,
  errorMessage,
  ...props
}: {
  label: string;
  description?: string;
  errorMessage?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea id={id} {...props} />
      <FieldError errors={[{ message: errorMessage }]} />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
