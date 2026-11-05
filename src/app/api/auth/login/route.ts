import bcrypt from "bcryptjs";
import { z } from "zod";
import { createSession } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      return Response.json({ error: "Email or password is incorrect" }, { status: 401 });
    }
    await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });
    return Response.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    return errorResponse(error);
  }
}
