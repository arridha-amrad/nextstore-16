import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { ChildrenProps } from "@/types";
import { Search, ShoppingCart } from "lucide-react";

export default function MainLayout({ children }: ChildrenProps) {
  return (
    <div className="container mx-auto p-4 lg:p-6">
      <nav className="flex items-end py-4 gap-x-6">
        <div>
          <h1 className="font-bold text-4xl pb-1">Nextstore</h1>
        </div>
        <div>
          <Button variant={"ghost"}>Categories</Button>
        </div>
        <InputGroup>
          <InputGroupInput placeholder="Enter product name..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <div className="flex h-full items-center gap-x-4">
          <ShoppingCart />
          <Button variant={"ghost"}>Signin</Button>
          <Button variant={"outline"}>Signup</Button>
        </div>
      </nav>
      <div className="py-6">{children}</div>
    </div>
  );
}
