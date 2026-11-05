import { ZodError } from "zod";

export function errorResponse(error: unknown) {
  if (error instanceof Response) return error;
  if (error instanceof ZodError) {
    return Response.json({ error: "Invalid request", details: error.flatten() }, { status: 400 });
  }
  if (error instanceof SyntaxError) {
    return Response.json({ error: "Request body must contain valid JSON" }, { status: 400 });
  }
  console.error(error);
  return Response.json({ error: "An unexpected error occurred" }, { status: 500 });
}

export function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value / 100);
}
