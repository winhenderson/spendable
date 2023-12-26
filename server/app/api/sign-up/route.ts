export const dynamic = "force-dynamic"; // defaults to force-static
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();
  // TODO: handle when user already exists flow
  // const user_found = await prisma.public_users.findFirst({
  //   where: { email: body.email },
  // });

  const user = await prisma.public_users.create({
    data: {
      email: body.email,
      auth_id: body.id,
      amount: 250,
    },
  });

  return Response.json({ id: user.id, email: user.email, amount: user.amount });
}
