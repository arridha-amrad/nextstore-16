import { fetchCategories } from "@/app/admin/products/query";
import { getServerSession } from "@/lib/auth";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import NavCategoriesMenu from "./nav-categories-menu";
import {
  NavbarAuthButtons,
  NavbarCart,
  NavbarSearch,
  NavbarUserDropDown,
} from "./navbar-client-components";

const NavSkeleton = () => {
  return (
    <div className="border rounded-2xl">
      <Skeleton className="w-40 h-10" />
    </div>
  );
};

export default function Navbar() {
  return (
    <nav className="flex h-full items-center py-6 gap-x-6">
      <Link href="/" className="font-bold text-4xl pb-1">
        Nextstore
      </Link>
      <Categories />
      <NavbarSearch />
      <div className="flex h-full items-center gap-x-4">
        <Suspense>
          <NavbarCart />
        </Suspense>
        <Suspense fallback={<NavSkeleton />}>
          <NavAuth />
        </Suspense>
      </div>
    </nav>
  );
}

async function Categories() {
  "use cache";
  const categories = await fetchCategories();

  return <NavCategoriesMenu categories={categories} />;
}

async function NavAuth() {
  const session = await getServerSession();

  return session ? (
    <NavbarUserDropDown user={session.user} />
  ) : (
    <NavbarAuthButtons />
  );
}
