export const dynamic = "force-dynamic"; // defaults to force-static
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { user_id: string } }
) {
  const user_id = params.user_id;
  const body = await request.json();

  await prisma.public_users.update({
    where: { id: user_id },
    data: { amount: body.newAmount },
  });

  return Response.json(true);
}
