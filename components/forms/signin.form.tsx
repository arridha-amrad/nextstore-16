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
import { sendVerificationEmail, signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export default function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showVerify, setShowVerify] = useState(false);
  const [isSendVerification, setIsSendVerification] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const resendVerification = async () => {
    const email = localStorage.getItem("email");
    if (!email) return;
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
          setShowVerify(false);
          toast.error(error.message, {
            duration: 3000,
            position: "bottom-center",
          });
        },
        onSuccess: () => {
          setShowVerify(false);
          setMessage(
            `An email has been sent to ${email}. Please follow the instructions to verify your email`
          );
        },
        onResponse: () => {
          setIsSendVerification(false);
        },
      }
    );
  };

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
      await signIn.email(
        {
          email,
          password,
        },
        {
          onSuccess: () => {
            router.push("/");
          },
          onError: ({ error }) => {
            localStorage.setItem("email", email);
            if (error.status === 403) {
              setShowVerify(true);
              return;
            }
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
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
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
                  {isSendVerification && <Spinner />}
                  Click here
                </Button>
                to resend verification email.
              </div>
            ) : true ? (
              <p className="text-sm text-center text-green-500">{message}</p>
            ) : (
              " Login with your Apple or Google account"
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
