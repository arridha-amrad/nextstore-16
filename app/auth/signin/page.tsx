import SigninForm from "@/app/auth/signin/signin.form";
import { Suspense } from "react";

export default function SigninPage() {
  return (
    <Suspense>
      <SigninForm />
    </Suspense>
  );
}
