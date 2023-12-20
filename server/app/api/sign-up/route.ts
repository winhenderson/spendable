export const dynamic = "force-dynamic"; // defaults to force-static
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();

  await prisma.public_users.create({
    data: {
      email: body.email,
      auth_id: body.id,
    },
  });

  return Response.json(true);
}
