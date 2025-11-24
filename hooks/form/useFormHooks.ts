import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import {
  TextField,
  PasswordField,
  TextareaField,
  NumberField,
} from "./field.components";
import { SubmitButton } from "./form.components";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    PasswordField,
    TextareaField,
    NumberField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
