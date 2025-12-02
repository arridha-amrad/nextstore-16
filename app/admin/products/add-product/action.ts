"use server";

import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { actionClient, MyCustomError } from "@/lib/safe-action";
import { slugify } from "@/lib/utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { flattenValidationErrors } from "next-safe-action";
import { updateTag } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

const inputSchema = zfd.formData({
  name: zfd.text(z.string().min(1, { error: "required" })),
  category: zfd.text(z.string().min(1, "required")),
  price: zfd.numeric(z.number().gt(0)),
  stock: zfd.numeric(z.number().gt(0)),
  discount: zfd.numeric(z.number().gte(0)),
  descriptionHtml: zfd.text(),
  descriptionJson: zfd.text(),
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
        discount,
        image1,
        price,
        stock,
        image2,
        image3,
        image4,
        descriptionHtml,
        descriptionJson,
        category,
        name,
      },
    }) => {
      try {
        await prisma.product.create({
          data: {
            name,
            price,
            stock,
            descriptionHtml,
            descriptionJson,
            discount,
            slug: slugify(name),
            productImages: {
              create: [image1, image2, image3, image4]
                .filter((v) => typeof v === "string")
                .map((img) => ({
                  url: img,
                })),
            },
            category: {
              connectOrCreate: {
                create: { title: category },
                where: { title: category },
              },
            },
          },
        });
        updateTag(cacheKeys.products.admin);
        updateTag(cacheKeys.products.user);
        return "ok";
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
