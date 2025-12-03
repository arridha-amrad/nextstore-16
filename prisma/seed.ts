import prisma from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import { hash } from "@node-rs/argon2";

async function createUsers() {
  const result = await prisma.user.createManyAndReturn({
    skipDuplicates: true,
    data: Array.from({ length: 10 }).map(() => ({
      email: faker.internet.email(),
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      emailVerified: true,
      image: faker.image.avatar(),
      role: "user",
    })),
  });
  const hashedPassword = await hash("123");
  const ids = result.map((r) => r.id);
  await prisma.account.createMany({
    skipDuplicates: true,
    data: ids.map((id) => ({
      id: faker.string.uuid(),
      accountId: id,
      providerId: "credentials",
      userId: id,
      password: hashedPassword,
    })),
  });
}

async function main() {
  await createUsers();
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
