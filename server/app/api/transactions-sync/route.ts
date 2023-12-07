export const dynamic = "force-dynamic"; // defaults to force-static
import { PrismaClient } from "@prisma/client";

import { Configuration, PlaidApi, PlaidEnvironments, Transaction } from "plaid";

const prisma = new PrismaClient();

const plaidClient = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments["sandbox"],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
        "PLAID-SECRET": process.env.PLAID_SECRET,
        "Plaid-Version": "2020-09-14",
      },
    },
  })
);

export async function GET() {
  const items = await prisma.items.findMany();

  let allTransactions: Transaction[] = [];

  for (const item of items) {
    if (!item?.plaid_access_token) {
      return Response.error();
    }

    const res = await plaidClient.transactionsSync({
      access_token: item.plaid_access_token,
    });

    const transactions = res.data.added;
    allTransactions = [...allTransactions, ...transactions];
  }

  return Response.json(allTransactions);
}
