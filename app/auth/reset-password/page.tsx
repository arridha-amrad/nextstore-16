import { Suspense } from "react";
import ResetPasswordForm from "./reset-password.form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nextstore | Reset Password",
  description: "Nextstore by devari reset-password page",
};

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />;
    </Suspense>
  );
}
