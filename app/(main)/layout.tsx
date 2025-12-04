import { ChildrenProps } from "@/types";
import Navbar from "./navbar";
import { Suspense } from "react";

export default function MainLayout({ children }: ChildrenProps) {
  return (
    <div className="container mx-auto p-4 lg:p-6">
      <Suspense>
        <Navbar />
      </Suspense>
      <div className="py-6">{children}</div>
    </div>
  );
}
