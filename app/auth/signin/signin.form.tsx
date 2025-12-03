"use client";

import GoogleAuthButton from "@/components/buttons/google-auth.button";
import { Button } from "@/components/ui/button";
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
import { sendVerificationEmail, signIn } from "@/lib/auth-client";
import { signinSchema } from "@/lib/schema.zod";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showVerify, setShowVerify] = useState(false);
  const [isSendVerification, setIsSendVerification] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setMessage(null);
    setError(null);
  };

  const resendVerification = async () => {
    const email = localStorage.getItem("email");
    if (!email) return;
    resetState();
    const id = toast.loading("sending...");
    await sendVerificationEmail(
      {
        email,
        callbackURL: "/",
      },
      {
        onRequest: () => {
          setIsSendVerification(true);
        },
        onError: ({ error }) => {
          setError(error.message || "Something went wrong");
        },
        onSuccess: () => {
          setMessage(
            `An email has been sent to ${email}. Please follow the instructions to verify your email`
          );
        },
        onResponse: () => {
          toast.dismiss(id);
        },
      }
    );
  };

  const sp = useSearchParams();

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signinSchema,
    },
    onSubmit: async ({ value }) => {
      const { email, password } = value;
      setMessage(null);
      setError(null);
      await signIn.email(
        {
          email,
          password,
        },
        {
          onSuccess: () => {
            const callbackURL = sp.get("callbackUrl");
            let to = "/";
            if (callbackURL) {
              to = callbackURL;
            }
            router.push(to);
          },
          onError: ({ error }) => {
            if (error.status === 403) {
              localStorage.setItem("email", email);
              setShowVerify(true);
              return;
            }
            setError(error.message || "Something went wrong.");
          },
        }
      );
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription
            className={cn(
              message ? "text-green-500" : error ? "text-red-500" : ""
            )}
          >
            {showVerify ? (
              <div className="mb-4 text-center text-red-400 text-sm">
                Verification required.
                <Button
                  disabled={isSendVerification}
                  type="button"
                  onClick={resendVerification}
                  size="sm"
                  variant="ghost"
                >
                  Click here
                </Button>
                to resend verification email.
              </div>
            ) : (
              message ?? error ?? " Login with your Email or Google account"
            )}
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
                  <Link href={"/auth/forgot-password"}>forgot password</Link>
                </FieldDescription>
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
            <FieldDescription className="text-center">
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
