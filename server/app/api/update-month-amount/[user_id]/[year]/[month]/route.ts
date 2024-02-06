export const dynamic = "force-dynamic"; // defaults to force-static
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { user_id: string; year: number; month: number } }
) {
  const user_id = params.user_id;
  const year = params.year;
  const month = String(params.month).padStart(2, "0");
  const body = await request.json();

  await prisma.months.upsert({
    where: { user_id: user_id, date: `${month}-${year}` },
    create: {
      user_id: user_id,
      amount: body.newAmount,
      date: `${month}-${year}`,
    },
    update: { amount: body.newAmount },
  });

  return Response.json(true);
}
