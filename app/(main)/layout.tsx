import { ChildrenProps } from "@/types";
import Navbar from "./navbar";

export default function MainLayout({ children }: ChildrenProps) {
  return (
    <div className="container mx-auto h-24">
      <Navbar />
      <div className="py-6">{children}</div>
    </div>
  );
}
