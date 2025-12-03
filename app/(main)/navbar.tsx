import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { fetchCategories } from "../admin/products/query";
import NavCategoriesMenu from "./nav-categories-menu";
import NavbarAuthButtons from "./navbar-auth-buttons";
import NavbarSearch from "./navbar-search";
import { Suspense } from "react";

export default async function Navbar() {
  const categories = await fetchCategories();
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
          <NavbarAuthButtons />
        </div>
      </nav>
    </Suspense>
  );
}
