import { prisma } from "@/helpers";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic"; // defaults to force-static

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.item_id || !body.title || !body.amount || !body.date) {
    throw new Error("a field is missing in the create-new-transaction request");
  }

  const res = await prisma.transactions.create({
    data: {
      transaction_date: body.date,
      name: body.title,
      amount: body.amount,
      item_id: body.item_id,
      pending: false,
      id: randomUUID(),
    },
  });
  if (!res) {
    throw new Error("Failed to create new transaction");
  }

  return Response.json(true);
}
