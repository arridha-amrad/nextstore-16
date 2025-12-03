import { env } from "@/lib/env";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { faker } from "@faker-js/faker";
import { hash } from "@node-rs/argon2";

async function createUsers() {
  const result = await prisma.user.createManyAndReturn({
    skipDuplicates: true,
    data: Array.from({ length: 10 }).map(() => ({
      email: faker.internet.email().toLowerCase(),
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      emailVerified: true,
      image: faker.image.avatar(),
      role: "user",
    })),
  });
  const hashedPassword = await hash("Nextstore123");
  const ids = result.map((r) => r.id);
  await prisma.account.createMany({
    skipDuplicates: true,
    data: ids.map((id) => ({
      id: faker.string.uuid(),
      accountId: id,
      providerId: "credential",
      userId: id,
      password: hashedPassword,
    })),
  });
}

async function createProducts() {
  const categoryList = Array.from({ length: 10 }).map(
    (_, i) => `category-${i + 1}`
  );
  const categories = await prisma.productCategory.createManyAndReturn({
    data: categoryList.map((c) => ({
      title: c,
    })),
  });

  for (let i = 0; i < 100; i++) {
    const productName = faker.commerce.productName();
    const slug = slugify(productName);
    await prisma.product.create({
      data: {
        name: productName,
        slug,
        price: parseInt(faker.commerce.price({ min: 100, max: 1000, dec: 0 })),
        stock: faker.number.int({ min: 5, max: 100 }),
        discount: faker.number.int({ min: 0, max: 100 }),
        descriptionHtml: `<p>${faker.commerce.productDescription()}</p>`,
        productImages: {
          createMany: {
            data: Array.from({ length: 2 }).map((v) => ({
              url: "/sample-img.png",
            })),
          },
        },
        category: {
          connect: {
            title: faker.helpers.arrayElement(categories).title,
          },
        },
      },
    });
  }
}

async function main() {
  // await createUsers();
  await createProducts();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
