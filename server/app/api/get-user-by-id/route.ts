export const dynamic = "force-dynamic"; // defaults to force-static
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();
  if (body.id === undefined) {
    throw new Error("no id in request body of get-user-by-id");
  }

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
              created_at: true,
              amount: true,
              name: true,
            },
          },
        },
      },
    },
    where: { auth_id: body.id },
  });

  if (!dbResult) {
    throw new Error("bad request");
  }

  const user = {
    transactions: dbResult.items.map((i) =>
      i.transactions.map((t) => {
        return { id: t.id, date: t.created_at, amount: t.amount, name: t.name };
      })
    ),
    id: dbResult.id,
    amount: dbResult.amount,
    email: dbResult.amount,
  };

  if (!user) {
    throw new Error("Invalid credentials");
  }

  return Response.json(user);
}
