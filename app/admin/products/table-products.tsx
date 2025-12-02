"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatToIDR } from "@/lib/utils";
import { ProductModel } from "@/models/product.model";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const className = {
  head: "w-max font-semibold text-left",
};

type Props = {
  products: ProductModel[];
  totalProduct: number;
  productsPerPage: number;
};

export default function TableProducts({
  products,
  productsPerPage,
  totalProduct,
}: Props) {
  const sp = useSearchParams();
  const page = parseInt(sp.get("page") ?? "1");
  const intPage = isNaN(page) ? 1 : page;
  const s = (intPage - 1) * 10;
  return (
    <div className="space-y-4">
      <Table>
        <TableCaption>A list of products.</TableCaption>
        <TableHeader className="bg-foreground/10">
          <TableRow>
            <TableHead className={className.head}>No.</TableHead>
            <TableHead className={className.head}>Name</TableHead>
            <TableHead className={className.head}>Category</TableHead>
            <TableHead className={cn(className.head, "px-4")}>Price</TableHead>
            <TableHead className={className.head}>Stock</TableHead>
            <TableHead className={className.head}>Discount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p, i) => (
            <TableRow key={p.id}>
              <TableCell>{i + 1 + s}</TableCell>
              <TableCell>
                <Link
                  href={`/admin/products/${p.id}`}
                  title={p.name}
                  className="w-fit line-clamp-2 text-wrap"
                >
                  {p.name}
                </Link>
              </TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell className="px-4">{formatToIDR(p.price)}</TableCell>
              <TableCell className="text-center">{p.stock}</TableCell>
              <TableCell className="text-center">
                {p.discount === 0 ? "-" : p.discount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        currPage={intPage}
        totalPage={Math.ceil(totalProduct / productsPerPage)}
      />
    </div>
  );
}

function TablePagination({
  totalPage,
  currPage,
}: {
  totalPage: number;
  currPage: number;
}) {
  return (
    <Pagination>
      <PaginationContent>
        {[...Array(totalPage)].fill("").map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currPage === i + 1}
              href={`/admin/products?page=${i + 1}`}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
}
