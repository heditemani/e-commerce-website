import { getSession } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: "Authentication required" }, { status: 401 });
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        addresses: { orderBy: { createdAt: "desc" } },
        orders: { orderBy: { createdAt: "desc" }, include: { items: true } },
      },
    });
    if (!user) return Response.json({ error: "Account not found" }, { status: 401 });
    return Response.json({ user });
  } catch (error) {
    return errorResponse(error);
  }
}
