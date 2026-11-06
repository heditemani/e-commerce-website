import { z } from "zod";
import { getSession } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  subject: z.string().trim().min(2).max(140),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  try {
    const input = contactSchema.parse(await request.json());
    const savedMessage = await prisma.contactMessage.create({
      data: { name: input.name, email: input.email, subject: input.subject, message: input.message },
    });
    return Response.json({ success: true, id: savedMessage.id }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: "Authentication required" }, { status: 401 });
    if (session.role !== "ADMIN") return Response.json({ error: "Administrator access required" }, { status: 403 });
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    return Response.json({ messages });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: "Authentication required" }, { status: 401 });
    if (session.role !== "ADMIN") return Response.json({ error: "Administrator access required" }, { status: 403 });
    const input = z.object({
      messageId: z.string().min(1),
      status: z.enum(["NEW", "READ", "RESOLVED"]),
    }).parse(await request.json());
    const result = await prisma.contactMessage.updateMany({
      where: { id: input.messageId },
      data: { status: input.status },
    });
    if (!result.count) return Response.json({ error: "Message not found" }, { status: 404 });
    return Response.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
