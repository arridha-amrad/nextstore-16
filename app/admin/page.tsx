import data from "./data.json";
import { SectionCards } from "@/components/section-cards";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function AdminPage() {
  return (
    <>
      <SectionCards />
      {/* <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div> */}
      {/* <Suspense fallback={<Spinner />}>
        <DataTable data={data} />
      </Suspense> */}
    </>
  );
}
