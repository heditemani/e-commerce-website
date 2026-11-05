import { OrderStatus, Prisma, UserRole } from "@prisma/client";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(20),
    variant: z.record(z.string(), z.string()).optional(),
  })).min(1).max(50),
  address: z.object({
    name: z.string().trim().min(1).max(100),
    line1: z.string().trim().min(1).max(200),
    line2: z.string().trim().max(200).optional(),
    city: z.string().trim().min(1).max(100),
    region: z.string().trim().min(1).max(100),
    postalCode: z.string().trim().min(1).max(20),
    country: z.string().trim().length(2).default("US"),
    phone: z.string().trim().max(30).optional(),
  }),
});

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
    const orders = await prisma.order.findMany({
      where: user.role === UserRole.ADMIN ? {} : { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true, user: { select: { id: true, name: true, email: true } } },
    });
    return Response.json({ orders });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSession();
    if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
    const input = orderSchema.parse(await request.json());
    const quantities = new Map<string, number>();
    for (const item of input.items) {
      quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
    }

    const order = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({ where: { id: { in: [...quantities.keys()] } } });
      if (products.length !== quantities.size) {
        throw Response.json({ error: "One or more products are no longer available" }, { status: 409 });
      }

      for (const [productId, quantity] of quantities) {
        const result = await tx.product.updateMany({
          where: { id: productId, stock: { gte: quantity } },
          data: { stock: { decrement: quantity }, popularity: { increment: quantity } },
        });
        if (!result.count) throw Response.json({ error: "Insufficient stock for an item in your cart" }, { status: 409 });
      }

      const productsById = new Map(products.map((product) => [product.id, product]));
      const subtotal = input.items.reduce((sum, item) => {
        const product = productsById.get(item.productId)!;
        return sum + product.price * item.quantity;
      }, 0);
      const tax = Math.round(subtotal * 0.08);
      const shipping = subtotal >= 10000 ? 0 : 800;
      const addressData = { ...input.address, line2: input.address.line2 || null, phone: input.address.phone || null };
      const savedAddressCount = await tx.address.count({ where: { userId: user.id } });
      await tx.address.create({
        data: { ...addressData, userId: user.id, isDefault: savedAddressCount === 0 },
      });

      return tx.order.create({
        data: {
          userId: user.id,
          subtotal,
          tax,
          shipping,
          total: subtotal + tax + shipping,
          shippingAddress: addressData,
          paymentReference: `mock_${crypto.randomUUID()}`,
          items: {
            create: input.items.map((item) => {
              const product = productsById.get(item.productId)!;
              return {
                productId: product.id,
                name: product.name,
                unitPrice: product.price,
                quantity: item.quantity,
                variant: item.variant ?? Prisma.JsonNull,
              };
            }),
          },
        },
        include: { items: true },
      });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return Response.json({ order }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      return Response.json({ error: "Inventory changed while placing your order. Please review your cart and try again." }, { status: 409 });
    }
    return errorResponse(error);
  }
}

const statusSchema = z.object({ status: z.nativeEnum(OrderStatus) });

export async function PATCH(request: Request) {
  try {
    const user = await getSession();
    if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
    if (user.role !== UserRole.ADMIN) return Response.json({ error: "Administrator access required" }, { status: 403 });
    const { orderId, status } = z.object({ orderId: z.string().min(1), ...statusSchema.shape }).parse(await request.json());
    const result = await prisma.order.updateMany({ where: { id: orderId }, data: { status } });
    if (!result.count) return Response.json({ error: "Order not found" }, { status: 404 });
    return Response.json({ order: await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } }) });
  } catch (error) {
    return errorResponse(error);
  }
}
