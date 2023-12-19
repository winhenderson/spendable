export const dynamic = "force-dynamic"; // defaults to force-static
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();
  const res = await prisma.users.findFirst({
    where: { email: body.email },
  });

  return Response.json({ email: res?.email ?? "" });
}
