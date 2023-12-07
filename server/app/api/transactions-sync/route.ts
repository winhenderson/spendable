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

    await prisma.transactions.createMany({
      data: transactions.map((transaction) => {
        return {
          transaction_id: transaction.transaction_id,
          account_id: transaction.account_id,
          transaction_date: transaction.date,
          amount: transaction.amount,
          currency: transaction.iso_currency_code,
          category: transaction.personal_finance_category?.detailed,
          merchant_name: transaction.merchant_name,
          pending: transaction.pending,
          logo_url: transaction.logo_url,
          name: transaction.name,
          website: transaction.website,
        };
      }),
    });
    allTransactions = [...allTransactions, ...transactions];
  }

  return Response.json(allTransactions);
}
