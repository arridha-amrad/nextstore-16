import { Suspense } from "react";
import ForgotPasswordForm from "./forgot-password.form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nextstore | Forgot Password",
  description: "Nextstore by devari forgot password page",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
