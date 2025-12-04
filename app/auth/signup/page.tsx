import SignupForm from "@/app/auth/signup/signup.form";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Nextstore | Signup",
  description: "Nextstore by devari signup page",
};

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />;
    </Suspense>
  );
}
