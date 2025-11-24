"use client";

import { signOut } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
        },
      },
    });
  };
  return <Button onClick={handleLogout}>Logout</Button>;
}
