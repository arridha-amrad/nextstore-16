"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ChevronDown, Search, ShoppingCart, User } from "lucide-react";
import Form from "next/form";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthUser } from "@/lib/auth";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

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

export function NavbarUserDropDown({ user }: { user: AuthUser }) {
  const router = useRouter();

  const logout = async () => {
    await signOut();
    router.replace("/auth/signin");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <User />
          {user.name}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.role === "admin" && (
          <DropdownMenuItem onClick={() => router.push("/admin")}>
            Admin
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => router.push("/orders")}>
          Orders
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} variant="destructive">
          Logout
        </DropdownMenuItem>
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
