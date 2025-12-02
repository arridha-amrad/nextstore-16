import SignupForm from "@/app/auth/signup/signup.form";
import { Suspense } from "react";

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />;
    </Suspense>
  );
}
