export const dynamic = "force-dynamic"; // defaults to force-static

import { prisma } from "@/helpers";

export async function POST(request: Request) {
  const body = await request.json();

  const items = await prisma.items.findMany({
    select: { id: true },
    where: { user_id: body.user_id },
  });

  const transaction = await prisma.transactions.findFirst({
    select: { id: true, ignore: true },
    where: { id: body.transaction_id, item_id: { in: items.map((i) => i.id) } },
  });

  if (!transaction) {
    return new Response("", {
      status: 404,
    });
  }

  await prisma.transactions.update({
    where: {
      id: transaction.id,
    },
    data: {
      ignore: !transaction.ignore,
    },
  });

  return new Response(null, { status: 204 });
}
