import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { cacheTag } from "next/cache";

export const fetchCategories = async () => {
  "use cache";
  cacheTag(cacheKeys.productCategories);

  const categories = prisma.productCategory.findMany({
    orderBy: { title: "asc" },
  });

  return categories;
};
