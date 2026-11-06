import { Prisma, PrismaClient } from "@prisma/client";
import { demoCategories, demoProducts, generatedProducts } from "../src/lib/catalog-data";

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

  const generatedSlugs = generatedProducts.map((product) => product.slug);
  const existingProducts = await prisma.product.findMany({
    where: { slug: { in: generatedSlugs } },
    select: { slug: true },
  });
  const existingSlugs = new Set(existingProducts.map((product) => product.slug));
  const categories = await prisma.category.findMany({ select: { id: true, slug: true } });
  const categoryIds = new Map(categories.map((category) => [category.slug, category.id]));
  const newProducts = generatedProducts
    .filter((product) => !existingSlugs.has(product.slug))
    .map(({ categorySlug, ...product }) => {
      const categoryId = categoryIds.get(categorySlug);
      if (!categoryId) throw new Error(`Missing database category: ${categorySlug}`);
      return {
        ...product,
        categoryId,
        variants: product.variants ?? Prisma.DbNull,
      };
    });

  for (let index = 0; index < newProducts.length; index += 50) {
    await prisma.product.createMany({ data: newProducts.slice(index, index + 50) });
  }

  const productCount = await prisma.product.count();
  console.log(`Catalog ready: ${productCount} products total (${generatedProducts.length} generated catalog products).`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
