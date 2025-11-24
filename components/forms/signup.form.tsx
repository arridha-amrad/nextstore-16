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
import { signUp } from "@/lib/auth-client";
import { signupSchema } from "@/lib/schema.zod";
import { cn } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";
import GoogleAuthButton from "../buttons/google-auth.button";

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: signupSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      formApi.reset();
      const { email, name, password } = value;
      await signUp.email(
        {
          email,
          name,
          password,
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            toast.success(
              "signup successful. please check your email inbox to verify your email.",
              {
                duration: 5000,
                position: "bottom-center",
              }
            );
          },
          onError: ({ error }) => {
            toast.error(error.message || "Something went wrong.", {
              duration: 3000,
              position: "bottom-center",
            });
          },
        }
      );
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Fill in the form below to create your account
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
                name="name"
                children={(field) => (
                  <field.TextField label="Fullname" placeholder="John Doe" />
                )}
              />
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField label="Email" placeholder="john@mail.com" />
                )}
              />

              <div className="flex items-start gap-4">
                <form.AppField
                  name="password"
                  children={(field) => <field.PasswordField />}
                />
                <form.AppField
                  name="confirmPassword"
                  children={(field) => (
                    <field.TextField
                      type="password"
                      label="Confirm Password"
                      placeholder="****"
                    />
                  )}
                />
              </div>
              <Field>
                <form.AppForm>
                  <form.SubmitButton label="Signup" />
                </form.AppForm>
                <FieldDescription className="text-center">
                  Already have an account?&nbsp;
                  <Link href="/auth/signin">Signin</Link>
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
            <FieldDescription className="px-6 text-center">
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
