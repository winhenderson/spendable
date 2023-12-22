export const dynamic = "force-dynamic"; // defaults to force-static
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();
  // TODO: handle when user already exists flow
  // const user_found = await prisma.public_users.findFirst({
  //   where: { email: body.email },
  // });

  await prisma.public_users.create({
    data: {
      email: body.email,
      auth_id: body.id,
    },
  });

  return Response.json(true);
}
