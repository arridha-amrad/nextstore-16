"use server";

import { cacheKeys } from "@/cache-keys";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { updateTag } from "next/cache";
import z from "zod";
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

export const editProductAction = actionClient
  .bindArgsSchemas<[productId: z.ZodString]>([z.string()])
  .inputSchema(inputSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      bindArgsParsedInputs: [productId],
      parsedInput: {
        category,
        descriptionHtml,
        descriptionJson,
        discount,
        image1,
        name,
        price,
        stock,
        image2,
        image3,
        image4,
      },
    }) => {
      try {
        await prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            name,
            price,
            stock,
            descriptionHtml,
            descriptionJson,
            discount,
            productImages: {
              deleteMany: {
                productId,
              },
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
        updateTag(cacheKeys.products);
        updateTag(cacheKeys.product(productId));
        return "updated";
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  );
