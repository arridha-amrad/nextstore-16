import Navbar from "@/components/navbar";
import { ChildrenProps } from "@/types";

export default async function MainLayout({ children }: ChildrenProps) {
  return (
    <div className="container mx-auto p-4 lg:p-6">
      <Navbar />
      <div className="py-6">{children}</div>
    </div>
  );
}
