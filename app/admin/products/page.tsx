import { DataTable } from "@/components/data-table";
import data from "../data.json";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Nextstore | Products",
  description: "List of product of nextstore",
};

export default function ProductsAdminPage() {
  return (
    <>
      <DataTable data={data} />
    </>
  );
}
