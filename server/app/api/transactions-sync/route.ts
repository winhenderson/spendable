export const dynamic = "force-dynamic"; // defaults to force-static
import { PrismaClient, Prisma } from "@prisma/client";

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

  let dbTransactions = await prisma.transactions.findMany();
  let allTransactions = [...dbTransactions.map((t) => convertDbTransaction(t))];

  for (const item of items) {
    if (!item?.plaid_access_token) {
      return Response.error();
    }

    const res = await plaidClient.transactionsSync({
      access_token: item.plaid_access_token,
      cursor: item.cursor ?? undefined,
    });

    const plaidTransactions = res.data.added;
    const transactions = plaidTransactions.map((transaction) =>
      convertPlaidTransaction(transaction)
    );

    prisma.items.update({
      data: { cursor: res.data.next_cursor },
      where: { id: item.id },
    });

    prisma.transactions.createMany({
      data: plaidTransactions.map((t) => createDbTransaction(t)),
    });

    allTransactions = allTransactions.concat(transactions);
  }

  return Response.json(allTransactions);
}

function createDbTransaction(
  plaidTransaction: Transaction
): Prisma.$transactionsPayload["scalars"] {
  return {
    id: BigInt(true),
    created_at: new Date(),
    account_id: plaidTransaction.account_id,
    transaction_date: plaidTransaction.date,
    amount: new Prisma.Decimal(plaidTransaction.amount),
    currency: plaidTransaction.iso_currency_code,
    category: plaidTransaction.personal_finance_category?.detailed ?? null,
    merchant_name: plaidTransaction.merchant_name ?? null,
    pending: plaidTransaction.pending,
    logo_url: plaidTransaction.logo_url ?? null,
    name: plaidTransaction.name,
    website: plaidTransaction.website ?? null,
  };
}

function convertDbTransaction(
  dbTransaction: Prisma.$transactionsPayload["scalars"]
): SimpleTransaction {
  return {
    id: dbTransaction.id.toString(),
    date: dbTransaction.transaction_date,
    amount: Number(dbTransaction.amount),
    name: dbTransaction.merchant_name || dbTransaction.name,
  };
}

function convertPlaidTransaction(
  plaidTransaction: Transaction
): SimpleTransaction {
  return {
    id: plaidTransaction.transaction_id,
    date: plaidTransaction.date,
    amount: plaidTransaction.amount,
    name: plaidTransaction.merchant_name || plaidTransaction.name,
  };
}

type SimpleTransaction = {
  id: string;
  date: string;
  amount: number;
  name: string;
};
