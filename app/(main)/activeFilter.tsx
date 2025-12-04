"use client";

import { useSearchParams } from "next/navigation";

export default function ActiveFilter() {
  const sp = useSearchParams();
  const category = sp.get("category");

  if (!category) {
    return null;
  }

  return (
    <div className="mb-6">
      <h1 className="italic">Search : {category}</h1>
    </div>
  );
}
