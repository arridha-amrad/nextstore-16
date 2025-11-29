"use server";

import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { actionClient, MyCustomError } from "@/lib/safe-action";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { flattenValidationErrors } from "next-safe-action";
import { updateTag } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

const slugify = (input: string): string => {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
};

const inputSchema = zfd.formData({
  name: zfd.text(z.string().min(1, { error: "required" })),
  category: zfd.text(z.string().min(1, "required")),
  price: zfd.numeric(z.number().gt(0)),
  stock: zfd.numeric(z.number().gt(0)),
  discount: zfd.numeric(z.number().gte(0)),
  description: zfd.text(),
  image1: zfd.text(z.url({ error: "invalid url" })),
  image2: zfd.text(z.url({ error: "invalid url" }).optional()),
  image3: zfd.text(z.url({ error: "invalid url" }).optional()),
  image4: zfd.text(z.url({ error: "invalid url" }).optional()),
});

export const addProductAction = actionClient
  .inputSchema(inputSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: {
        name,
        category,
        description,
        discount,
        image1,
        price,
        stock,
        image2,
        image3,
        image4,
      },
    }) => {
      try {
        await prisma.product.create({
          data: {
            name,
            price,
            stock,
            description,
            discount,
            slug: slugify(name),
            productImages: {
              create: [
                { url: image1 },
                { url: image2 },
                { url: image3 },
                { url: image4 },
              ].filter((v) => typeof v === "string"),
            },
            category: {
              connectOrCreate: {
                create: { title: category },
                where: { title: category },
              },
            },
          },
        });
        updateTag(cacheKeys.products);
      } catch (err) {
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code === "P2002"
        ) {
          throw new MyCustomError("product already exists");
        }
        throw err;
      }
    }
  );
