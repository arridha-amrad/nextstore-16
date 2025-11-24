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
import { requestPasswordReset } from "@/lib/auth-client";
import { forgotPasswordSchema } from "@/lib/schema.zod";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [message, setMessage] = useState<string | null>(null);
  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value: { email }, formApi }) => {
      await requestPasswordReset(
        {
          email,
          redirectTo: "http://localhost:3000/reset-password",
        },
        {
          onSuccess: () => {
            setMessage("Please check your email inbox");
            formApi.reset();
          },
        }
      );
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password</CardTitle>
          <CardDescription>
            Send a request to change your password
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
                name="email"
                children={(field) => (
                  <field.TextField
                    label="Email"
                    placeholder="john@doe@mail.com"
                    description="Please insert your registered email"
                  />
                )}
              />
              <Field>
                <form.AppForm>
                  <form.SubmitButton label="Submit" />
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
