import { Prisma, UserRole } from "@prisma/client";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const productUpdate = z.object({
  name: z.string().trim().min(1).max(160).optional(),
  slug: z.string().trim().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().trim().min(1).max(10000).optional(),
  price: z.number().int().nonnegative().optional(),
  compareAt: z.number().int().positive().nullable().optional(),
  images: z.array(z.string().url()).min(1).max(8).optional(),
  stock: z.number().int().nonnegative().optional(),
  categoryId: z.string().min(1).optional(),
  featured: z.boolean().optional(),
  variants: z.record(z.string(), z.array(z.string())).nullable().optional(),
});

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: { select: { name: true, slug: true } } },
    });
    if (!product) return Response.json({ error: "Product not found" }, { status: 404 });
    return Response.json({ product });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    if ((await getSession())?.role !== UserRole.ADMIN) {
      return Response.json({ error: "Administrator access required" }, { status: 403 });
    }
    const { slug } = await params;
    const input = productUpdate.parse(await request.json());
    const existing = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
    if (!existing) return Response.json({ error: "Product not found" }, { status: 404 });
    if (input.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: input.categoryId }, select: { id: true } });
      if (!category) return Response.json({ error: "Category not found" }, { status: 400 });
    }
    const { categoryId, variants, ...fields } = input;
    const product = await prisma.product.update({
      where: { slug },
      data: {
        ...fields,
        ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
        ...(variants === undefined ? {} : { variants: variants ?? Prisma.DbNull }),
      },
    });
    return Response.json({ product });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "A product with this slug already exists" }, { status: 409 });
    }
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    if ((await getSession())?.role !== UserRole.ADMIN) {
      return Response.json({ error: "Administrator access required" }, { status: 403 });
    }
    const { slug } = await params;
    const result = await prisma.product.deleteMany({ where: { slug } });
    if (!result.count) return Response.json({ error: "Product not found" }, { status: 404 });
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return Response.json({ error: "Products attached to order history cannot be deleted" }, { status: 409 });
    }
    return errorResponse(error);
  }
}
