import { Separator } from "@/components/ui/separator";
import { getServerSession } from "@/lib/auth";
import Link from "next/link";
import { fetchCategories } from "../admin/products/query";
import NavCategoriesMenu from "./nav-categories-menu";
import {
  NavbarAuthButtons,
  NavbarCart,
  NavbarSearch,
  NavbarUserDropDown,
} from "./navbar-client-components";

export default async function Navbar() {
  const categories = await fetchCategories();
  const session = await getServerSession();

  return (
    <nav className="flex h-full items-center py-6 gap-x-6">
      <Link href="/" className="font-bold text-4xl pb-1">
        Nextstore
      </Link>
      <NavCategoriesMenu categories={categories.map((c) => c.title)} />
      <NavbarSearch />
      <div className="flex h-full items-center gap-x-4">
        <NavbarCart />
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
  );
}
