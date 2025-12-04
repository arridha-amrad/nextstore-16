import SigninForm from "@/app/auth/signin/signin.form";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Nextstore | Signin",
  description: "Nextstore by devari signin page",
};

export default function SigninPage() {
  return (
    <Suspense>
      <SigninForm />
    </Suspense>
  );
}
