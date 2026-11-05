import { Prisma, UserRole } from "@prisma/client";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { demoCategories, getDemoProducts } from "@/lib/catalog-data";
import { errorResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const productInput = z.object({
  name: z.string().trim().min(1).max(160),
  slug: z.string().trim().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(1).max(10000),
  price: z.number().int().nonnegative(),
  compareAt: z.number().int().positive().nullable().optional(),
  images: z.array(z.string().url()).min(1).max(8),
  stock: z.number().int().nonnegative(),
  categoryId: z.string().min(1),
  featured: z.boolean().optional(),
  variants: z.record(z.string(), z.array(z.string())).nullable().optional(),
});

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  category: z.string().trim().min(1).max(180).optional(),
  q: z.string().trim().max(100).optional(),
  sort: z.enum(["popular", "newest", "price-asc", "price-desc"]).default("popular"),
}).refine((value) => value.minPrice === undefined || value.maxPrice === undefined || value.minPrice <= value.maxPrice, {
  message: "minPrice cannot be greater than maxPrice",
});

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const query = querySchema.parse(Object.fromEntries(params.entries()));
    const { page, limit, minPrice, maxPrice } = query;
    const where: Prisma.ProductWhereInput = {
      ...(query.category ? { category: { slug: query.category } } : {}),
      ...(query.q ? { name: { contains: query.q } } : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? { price: { ...(minPrice !== undefined ? { gte: minPrice } : {}), ...(maxPrice !== undefined ? { lte: maxPrice } : {}) } }
        : {}),
    };
    const orderBy: Prisma.ProductOrderByWithRelationInput =
      query.sort === "price-asc"
        ? { price: "asc" }
        : query.sort === "price-desc"
          ? { price: "desc" }
          : query.sort === "newest"
            ? { createdAt: "desc" }
            : { popularity: "desc" };

    if (!process.env.DATABASE_URL) {
      const direction = query.sort.endsWith("desc") ? -1 : 1;
      const demoResults = getDemoProducts()
        .filter((product) =>
          (!query.category || product.category.slug === query.category) &&
          (minPrice === undefined || product.price >= minPrice) &&
          (maxPrice === undefined || product.price <= maxPrice) &&
          (!query.q || product.name.toLowerCase().includes(query.q.toLowerCase())),
        )
        .sort((a, b) => {
          if (query.sort === "newest") return b.createdAt.localeCompare(a.createdAt);
          if (query.sort === "price-asc" || query.sort === "price-desc") return (a.price - b.price) * direction;
          return b.popularity - a.popularity;
        });
      const total = demoResults.length;
      return Response.json({
        products: demoResults.slice((page - 1) * limit, page * limit),
        categories: demoCategories.map((category, index) => ({
          id: `demo_category_${category.slug}`,
          ...category,
          createdAt: new Date("2025-01-01T00:00:00.000Z").toISOString(),
          _count: { products: [2, 1, 1][index] },
        })),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        demoMode: true,
      });
    }

    const [products, total, categories] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { category: { select: { name: true, slug: true } } },
      }),
      prisma.product.count({ where }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);
    return Response.json({ products, categories, pagination: { page, limit, total, pages: Math.ceil(total / limit) }, demoMode: false });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    if ((await getSession())?.role !== UserRole.ADMIN) {
      return Response.json({ error: "Administrator access required" }, { status: 403 });
    }
    const input = productInput.parse(await request.json());
    const category = await prisma.category.findUnique({ where: { id: input.categoryId }, select: { id: true } });
    if (!category) return Response.json({ error: "Category not found" }, { status: 400 });
    const { categoryId, variants, ...fields } = input;
    const product = await prisma.product.create({
      data: {
        ...fields,
        category: { connect: { id: categoryId } },
        ...(variants === undefined ? {} : { variants: variants ?? Prisma.DbNull }),
      },
    });
    return Response.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "A product with this slug already exists" }, { status: 409 });
    }
    return errorResponse(error);
  }
}
