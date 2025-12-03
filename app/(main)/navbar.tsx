import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { fetchCategories } from "../admin/products/query";
import NavCategoriesMenu from "./nav-categories-menu";
import {
  NavbarSearch,
  NavbarUserDropDown,
  NavbarAuthButtons,
} from "./navbar-client-components";
import { Suspense } from "react";
import { getServerSession } from "@/lib/auth";

export default async function Navbar() {
  const categories = await fetchCategories();
  const session = await getServerSession();
  const user = session?.user;
  return (
    <Suspense>
      <nav className="flex h-full items-center py-4 gap-x-6">
        <Link href="/" className="font-bold text-4xl pb-1">
          Nextstore
        </Link>
        <NavCategoriesMenu categories={categories.map((c) => c.title)} />
        <NavbarSearch />
        <div className="flex h-full items-center gap-x-4">
          <ShoppingCart />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:h-1/2"
          />
          {session ? (
            <NavbarUserDropDown session={session} />
          ) : (
            <NavbarAuthButtons />
          )}
        </div>
      </nav>
    </Suspense>
  );
}
