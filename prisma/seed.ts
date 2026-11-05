import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Home & Living", slug: "home-living" },
    { name: "Accessories", slug: "accessories" },
    { name: "Apparel", slug: "apparel" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }

  const home = await prisma.category.findUniqueOrThrow({ where: { slug: "home-living" } });
  const accessories = await prisma.category.findUniqueOrThrow({ where: { slug: "accessories" } });
  const apparel = await prisma.category.findUniqueOrThrow({ where: { slug: "apparel" } });
  const products = [
    {
      name: "Ritual Ceramic Vase",
      slug: "ritual-ceramic-vase",
      description: "A softly sculpted stoneware vase, made for a branch from the garden or simply the quiet beauty of its own shape. Hand-finished, so no two are exactly alike.",
      price: 6800,
      compareAt: null,
      images: ["https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=1000&q=85"],
      stock: 18,
      featured: true,
      popularity: 91,
      categoryId: home.id,
    },
    {
      name: "Everyday Linen Tote",
      slug: "everyday-linen-tote",
      description: "A roomy, unhurried carryall in sturdy washed linen. Long handles sit comfortably on the shoulder; a small inside pocket keeps the little things close.",
      price: 4200,
      compareAt: 5200,
      images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85"],
      stock: 27,
      featured: true,
      popularity: 74,
      categoryId: accessories.id,
      variants: { Color: ["Oat", "Olive", "Ink"] },
    },
    {
      name: "Soft Form Throw",
      slug: "soft-form-throw",
      description: "A generous, breathable throw woven from a soft cotton blend. The subtle texture and considered palette make it an easy layer for the sofa or the end of the bed.",
      price: 8900,
      compareAt: null,
      images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85"],
      stock: 12,
      featured: true,
      popularity: 63,
      categoryId: home.id,
      variants: { Color: ["Natural", "Moss"] },
    },
    {
      name: "The Daily Shirt",
      slug: "the-daily-shirt",
      description: "An easy-fitting shirt cut from breathable cotton poplin. Thoughtful proportions, a clean collar, and just enough room to make it yours, day after day.",
      price: 7600,
      compareAt: null,
      images: ["https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=85"],
      stock: 21,
      featured: false,
      popularity: 42,
      categoryId: apparel.id,
      variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["White", "Blue"] },
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
