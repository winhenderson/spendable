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

export async function POST(req: Request) {
  const body = await req.json();

  const items = await prisma.items.findMany({
    where: { user_id: body.user_id },
  });

  let dbTransactions = await prisma.transactions.findMany();
  let allTransactions = [...dbTransactions.map((t) => convertDbTransaction(t))];

  for (const item of items) {
    if (!item?.plaid_access_token) {
      return Response.error();
    }

    let has_more = true;
    const plaidTransactions: Transaction[] = [];
    let nextCursor = item.cursor;
    while (has_more) {
      const res = await plaidClient.transactionsSync({
        access_token: item.plaid_access_token,
        cursor: nextCursor ?? undefined,
      });

      console.log("in here", {
        more: res.data.added.length,
        has_more: res.data.has_more,
      });
      has_more = res.data.has_more;
      plaidTransactions.push(...res.data.added);
      nextCursor = res.data.next_cursor;
    }

    const transactions = plaidTransactions.map((transaction) =>
      convertPlaidTransaction(transaction)
    );

    await prisma.items.update({
      data: { cursor: nextCursor },
      where: { id: item.id },
    });

    await prisma.transactions.createMany({
      data: plaidTransactions.map((t) => createDbTransaction(t, item.id)),
    });

    allTransactions = allTransactions.concat(transactions);
  }

  return Response.json(allTransactions);
}

function createDbTransaction(
  plaidTransaction: Transaction,
  item_id: string
): Omit<Prisma.$transactionsPayload["scalars"], "id" | "created_at"> {
  return {
    item_id: item_id,
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
