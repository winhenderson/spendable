export const dynamic = "force-dynamic"; // defaults to force-static
import { prisma } from "@/helpers";

import {
  addNewTransactions,
  convertDbTransaction,
} from "../../get-month-transactions/[year]/[month]/[user_id]/route";

export async function GET(
  req: Request,
  { params }: { params: { user_id: string } }
) {
  const user_id = params.user_id;

  const dbTransactions = await prisma.transactions.findMany({
    where: {
      items: {
        user_id: user_id,
      },
    },
  });

  const items = await prisma.items.findMany({
    where: { user_id: user_id },
    select: { plaid_access_token: true, cursor: true, id: true },
  });

  let allTransactions = [...dbTransactions.map((t) => convertDbTransaction(t))];

  const newTransactions = await addNewTransactions(items);
  allTransactions = allTransactions.concat(newTransactions);

  return Response.json(allTransactions);
}
