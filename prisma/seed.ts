import { Prisma, PrismaClient } from "@prisma/client";
import { demoCategories, demoProducts } from "../src/lib/catalog-data";

const prisma = new PrismaClient();

async function main() {
  for (const category of demoCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }

  for (const { categorySlug, ...product } of demoProducts) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: categorySlug } });
    const data = {
      ...product,
      categoryId: category.id,
      variants: product.variants ?? Prisma.DbNull,
    };
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: data,
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
