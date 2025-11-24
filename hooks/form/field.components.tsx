import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFieldContext } from "./useFormHooks";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useId, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  label: string;
  placeholder: string;
  type?: string;
  description?: string;
  name?: string;
};
export function TextField({
  label,
  placeholder,
  type,
  description,
  name,
}: Props) {
  const field = useFieldContext<string>();
  const id = useId();
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        name={name ?? field.name}
        type={type ?? "text"}
        placeholder={placeholder}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldError errors={[{ message: field.state.meta.errors[0]?.message }]} />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}

export function NumberField({ label, placeholder, description }: Props) {
  const field = useFieldContext<number>();
  const id = useId();
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        type={"number"}
        placeholder={placeholder}
        value={field.state.value}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (value < 0) {
            return;
          }
          if (isNaN(value)) {
            return;
          }
          field.handleChange(value);
        }}
      />
      <FieldError errors={[{ message: field.state.meta.errors[0]?.message }]} />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}

export function PasswordField() {
  const [show, setShow] = useState(false);
  const field = useFieldContext<string>();
  const id = useId();
  return (
    <Field>
      <FieldLabel htmlFor={`${id}-password`}>Password</FieldLabel>
      <Input
        id={`${id}-password`}
        type={show ? "text" : "password"}
        placeholder="*****"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldError errors={[{ message: field.state.meta.errors[0]?.message }]} />
      <div className="flex items-center gap-1">
        <Checkbox
          id={id}
          checked={show}
          onCheckedChange={() => setShow((v) => !v)}
        />
        <Label htmlFor={id}>Show Password</Label>
      </div>
    </Field>
  );
}

export function TextareaField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  const id = useId();
  const field = useFieldContext<string>();
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldError errors={[{ message: field.state.meta.errors[0]?.message }]} />
    </Field>
  );
}
