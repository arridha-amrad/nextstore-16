"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "nextjs-toploader/app";

export default function NavbarAuthButtons() {
  const router = useRouter();

  return (
    <>
      <Button onClick={() => router.push("/auth/signin")} variant={"secondary"}>
        Signin
      </Button>
      <Button onClick={() => router.push("/auth/signup")} variant={"outline"}>
        Signup
      </Button>
    </>
  );
}
