"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

export function PaginationProducts({
  itemsPerPage,
  totalRecords,
}: {
  totalRecords: number;
  itemsPerPage: number;
}) {
  const totalPage = Math.ceil(totalRecords / itemsPerPage);
  const sp = useSearchParams();
  const page = parseInt(sp.get("page") ?? "1");
  const pathname = usePathname();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    params.set(key, value);
    return `${pathname}?${params.toString()}`;
  }

  if (totalPage === 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={updateParam("page", (page === 1 ? 1 : page - 1).toString())}
          />
        </PaginationItem>
        {Array.from({ length: totalPage }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              isActive={page === i + 1}
              href={updateParam("page", (i + 1).toString())}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={updateParam(
              "page",
              (page === totalPage ? totalPage : page + 1).toString()
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
