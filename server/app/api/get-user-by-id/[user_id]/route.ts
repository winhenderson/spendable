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
              created_at: true,
              amount: true,
              name: true,
            },
          },
        },
      },
    },
    where: { auth_id: user_id },
  });

  if (!dbResult) {
    throw new Error("bad request");
  }

  const user = {
    transactions: dbResult.items
      .map((i) =>
        i.transactions.map((t) => {
          return {
            id: t.id,
            date: t.created_at,
            amount: Number(t.amount),
            name: t.name,
          };
        })
      )
      .flat(),
    id: dbResult.id,
    amount: dbResult.amount ? Number(dbResult.amount) : null,
    email: dbResult.email,
  };

  if (!user) {
    throw new Error("Invalid credentials");
  }

  return Response.json(user);
}
