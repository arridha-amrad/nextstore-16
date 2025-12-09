import { SectionCards } from "@/components/section-cards";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import SuspenseComponent from "./suspense";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nextstore | Admin Dashboard",
};

export default function AdminPage() {
  return (
    <main className="px-4 lg:px-6">
      <SectionCards />
      <Suspense fallback={<Spinner />}>
        <SuspenseComponent />
      </Suspense>
    </main>
  );
}
