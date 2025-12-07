"use client";

import { IdWithName } from "@/app/api/shipping/types";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useId } from "react";

type Props = {
  label: string;
  options: IdWithName[];
  value: string;
  onValueChange: (v: string) => void;
};

export default function SelectOptions({
  label,
  options,
  onValueChange,
  value,
}: Props) {
  const id = useId();
  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger
          id={id}
          disabled={options.length === 0}
          className="w-full"
        >
          <SelectValue placeholder={`--Select ${label}`} />
        </SelectTrigger>
        <SelectContent onSelect={(e) => e}>
          {options.map((v) => (
            <SelectItem key={v.id} value={v.id.toString()}>
              {v.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
