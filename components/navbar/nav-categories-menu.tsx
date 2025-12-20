"use client";

import { fetchCategories } from "@/app/admin/products/query";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";

type Props = {
  categories: Awaited<ReturnType<typeof fetchCategories>>;
};

export default function NavCategoriesMenu({ categories }: Props) {
  const isMobile = useIsMobile();
  return (
    <NavigationMenu viewport={isMobile} className="">
      <NavigationMenuList className="flex-wrap">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 grid-cols-5 w-max relative">
              {categories.map((c, i) => (
                <ListItem key={i} title={c.title}>
                  {c.title}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({ title, ...props }: React.ComponentPropsWithoutRef<"li">) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={`/?category=${title}`}>
          <div className="text-sm leading-none font-medium">{title}</div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
