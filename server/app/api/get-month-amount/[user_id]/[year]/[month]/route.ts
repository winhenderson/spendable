export const dynamic = "force-dynamic"; // defaults to force-static
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { user_id: string; year: number; month: number } }
) {
  const user_id = params.user_id;
  const year = params.year;
  const month = String(params.month).padStart(2, "0");
  console.log("in the get month: ", month);

  const dbMonthResult = await prisma.months.findFirst({
    where: { user_id, date: `${month}-${year}` },
    select: { amount: true },
  });
  console.log(dbMonthResult);

  return Response.json(dbMonthResult?.amount ?? null);
}
