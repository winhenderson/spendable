export const dynamic = "force-dynamic"; // defaults to force-static
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();

  const user = await prisma.public_users.findFirst({
    where: { auth_id: body.user_id },
  });

  if (!user) {
    throw new Error("invalid credentials");
  }

  await prisma.public_users.update({
    where: { id: user.id },
    data: { amount: body.newAmount },
  });

  return Response.json(true);
}
