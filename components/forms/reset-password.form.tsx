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
import { resetPasswordSchema } from "@/lib/schema.zod";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      console.log({ value });
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            Return your account with a new password
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
