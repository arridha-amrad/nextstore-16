"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/form/useFormHooks";
import { resetPassword } from "@/lib/auth-client";
import { resetPasswordSchema } from "@/lib/schema.zod";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const sp = useSearchParams();

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      console.log({ value });
      const token = sp.get("token");
      if (!token) {
        toast.error("token is missing");
        return;
      }
      await resetPassword(
        {
          newPassword: value.password,
          token,
        },
        {
          onSuccess: ({}) => {
            setMessage("Reset password is successful");
            formApi.reset();
          },
          onError: ({ error }) => {
            setError(error.message || "Something went wrong");
          },
        }
      );
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription
            className={cn(
              message ? "text-green-500" : error ? "text-red-500" : ""
            )}
          >
            {message ?? error ?? "Return your account with a new password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField
                name="password"
                children={(field) => <field.PasswordField />}
              />
              <form.AppField
                name="confirmPassword"
                children={(field) => (
                  <field.TextField
                    label="Confirm Password"
                    placeholder="*****"
                    type="password"
                  />
                )}
              />
              <Field>
                <form.AppForm>
                  <form.SubmitButton label="Update My Password" />
                </form.AppForm>
                <FieldDescription className="text-center">
                  Back to&nbsp;
                  <Link href="/auth/signin">Signin</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
