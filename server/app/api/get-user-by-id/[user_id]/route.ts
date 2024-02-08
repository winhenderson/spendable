export const dynamic = "force-dynamic"; // defaults to force-static
import { prisma } from "@/helpers";

export async function GET(
  request: Request,
  { params }: { params: { user_id: string } }
) {
  const user_id = params.user_id;

  const dbResult = await prisma.public_users.findFirst({
    select: {
      id: true,
      amount: true,
      email: true,
      items: {
        select: {
          transactions: {
            select: {
              id: true,
              transaction_date: true,
              amount: true,
              name: true,
            },
          },
        },
      },
      months: {
        select: { date: true, amount: true },
      },
    },
    where: { auth_id: user_id },
  });

  if (!dbResult) {
    throw new Error(`bad request: ${user_id} `);
  }

  const monthsMap: Record<string, number> = {};
  for (const month of dbResult.months) {
    monthsMap[month.date] = Number(month.amount);
  }

  const user = {
    transactions: dbResult.items
      .map((i) =>
        i.transactions.map((t) => {
          return {
            id: t.id,
            date: t.transaction_date,
            amount: Number(t.amount),
            name: t.name,
          };
        })
      )
      .flat(),
    id: dbResult.id,
    defaultSpendable: dbResult.amount ? Number(dbResult.amount) : null,
    email: dbResult.email,
    months: monthsMap,
  };

  if (!user) {
    throw new Error("Invalid credentials");
  }

  return Response.json(user);
}
