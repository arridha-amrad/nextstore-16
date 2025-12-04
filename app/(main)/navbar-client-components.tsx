"use client";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import {
  ChevronDown,
  LogOutIcon,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import Form from "next/form";
import { useRef } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "nextjs-toploader/app";
import { signOut } from "@/lib/auth-client";
import { getServerSession } from "@/lib/auth";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavbarSearch() {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Form className="w-full" action={"/"}>
      <InputGroup>
        <InputGroupInput
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              formRef.current?.submit();
            }
          }}
          name="search"
          placeholder="Enter product name..."
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </Form>
  );
}

export function NavbarUserDropDown({
  session,
}: {
  session: Awaited<ReturnType<typeof getServerSession>>;
}) {
  const router = useRouter();
  const logout = async () => {
    await signOut();
    router.refresh();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <User />
          {session?.user.name}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} variant="destructive">
          Logout
        </DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NavbarAuthButtons() {
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

export function NavbarCart() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <ShoppingCart
      className={cn(pathname === "/cart" ? "fill-white" : "")}
      onClick={() => router.push("/cart")}
    />
  );
}
