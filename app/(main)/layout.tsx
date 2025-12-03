import { ChildrenProps } from "@/types";
import Navbar from "./navbar";
import { Suspense } from "react";

export default function MainLayout({ children }: ChildrenProps) {
  return (
    <div className="container mx-auto h-24">
      <Suspense>
        <Navbar />
      </Suspense>
      <div className="py-6">{children}</div>
    </div>
  );
}
