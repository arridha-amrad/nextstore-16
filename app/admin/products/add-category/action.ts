"use server";

import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { updateTag } from "next/cache";
import z from "zod";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  cat1: zfd.text(z.string().min(1, "required")),
  cat2: zfd.text(z.string().min(1, "required").optional()),
  cat3: zfd.text(z.string().min(1, "required").optional()),
  cat4: zfd.text(z.string().min(1, "required").optional()),
  cat5: zfd.text(z.string().min(1, "required").optional()),
  cat6: zfd.text(z.string().min(1, "required").optional()),
  cat7: zfd.text(z.string().min(1, "required").optional()),
  cat8: zfd.text(z.string().min(1, "required").optional()),
  cat9: zfd.text(z.string().min(1, "required").optional()),
  cat10: zfd.text(z.string().min(1, "required").optional()),
});

export const addCategoryAction = actionClient
  .inputSchema(schema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const keys = Object.keys(parsedInput) as Array<keyof typeof parsedInput>;
    const data = keys
      .map((k) => {
        const value = parsedInput[k];
        return value ? { title: value.toLowerCase() } : null;
      })
      .filter(Boolean) as { title: string }[];
    await prisma.productCategory.createMany({
      data,
      skipDuplicates: true,
    });
    updateTag(cacheKeys.productCategories);
  });
