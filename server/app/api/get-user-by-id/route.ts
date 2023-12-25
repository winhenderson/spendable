export const dynamic = "force-dynamic"; // defaults to force-static
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();

  const user = await prisma.public_users.findFirst({
    where: { auth_id: body.id },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  return Response.json({ email: user.email, amount: user.amount, id: user.id });
}
