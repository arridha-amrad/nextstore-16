"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { useAppForm } from "@/hooks/form/useFormHooks";
import { cn } from "@/lib/utils";
import { signinSchema } from "@/lib/schema.zod";
import GoogleAuthButton from "../buttons/google-auth.button";
import Link from "next/link";

export default function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signinSchema,
    },
    onSubmit: async ({ value }) => {
      console.log({ value });
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
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
            <FieldGroup className="gap-y-4">
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField
                    label="Email"
                    placeholder="john@doe@mail.com"
                  />
                )}
              />
              <form.AppField
                name="password"
                children={(field) => <field.PasswordField />}
              />
              <Field>
                <form.AppForm>
                  <form.SubmitButton label="Signin" />
                </form.AppForm>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?&nbsp;
                  <Link href="/auth/signup">Signup</Link>
                </FieldDescription>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <Field>
                <GoogleAuthButton />
              </Field>
            </FieldGroup>
          </form>
          <div className="mt-4">
            <FieldDescription className=" text-center">
              By clicking continue, you agree to our{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </FieldDescription>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
