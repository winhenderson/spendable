export const dynamic = "force-dynamic"; // defaults to force-static
import { plaidClient, prisma } from "@/helpers";
import { Prisma } from "@prisma/client";

import { Transaction } from "plaid";

export async function GET(
  req: Request,
  { params }: { params: { year: string; month: string; user_id: string } }
) {
  const user_id = params.user_id;
  const year = params.year;
  const month = params.month;

  const dbTransactions = await prisma.transactions.findMany({
    where: {
      transaction_date: { startsWith: `${year}-${month}` },
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

  const res = Response.json(allTransactions);
  return res;
}

export async function addNewTransactions(
  items: Array<Item>
): Promise<Array<SimpleTransaction>> {
  let allTransactions: Array<SimpleTransaction> = [];
  for (const item of items) {
    if (!item?.plaid_access_token) {
      throw new Error("No access token");
    }

    let has_more = true;
    const plaidTransactions: Transaction[] = [];
    let nextCursor = item.cursor;
    while (has_more) {
      const res = await plaidClient.transactionsSync({
        access_token: item.plaid_access_token,
        cursor: nextCursor ?? undefined,
      });

      has_more = res.data.has_more;
      plaidTransactions.push(...res.data.added);
      // also handle the data.modified ones and updateMany them to the transacciont table
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
      skipDuplicates: true,
    });

    allTransactions = allTransactions.concat(transactions);
  }

  return allTransactions;
}

type Item = {
  plaid_access_token: string;
  cursor: string | null;
  id: string;
};

export function createDbTransaction(
  plaidTransaction: Transaction,
  item_id: string
): Omit<Prisma.$transactionsPayload["scalars"], "created_at"> {
  return {
    id: plaidTransaction.transaction_id,
    ignore: false,
    item_id: item_id,
    account_id: plaidTransaction.account_id,
    transaction_date: plaidTransaction.date,
    amount: new Prisma.Decimal(plaidTransaction.amount * -1),
    currency: plaidTransaction.iso_currency_code,
    category: plaidTransaction.personal_finance_category?.detailed ?? null,
    merchant_name: plaidTransaction.merchant_name ?? null,
    pending: plaidTransaction.pending,
    logo_url: plaidTransaction.logo_url ?? null,
    name: plaidTransaction.name,
    website: plaidTransaction.website ?? null,
  };
}

export function convertDbTransaction(
  dbTransaction: Prisma.$transactionsPayload["scalars"]
): SimpleTransaction {
  return {
    id: dbTransaction.id.toString(),
    date: dbTransaction.transaction_date,
    amount: Number(dbTransaction.amount),
    name: dbTransaction.merchant_name || dbTransaction.name,
    logo_url: dbTransaction.logo_url ?? null,
    ignore: dbTransaction.ignore,
  };
}

export function convertPlaidTransaction(
  plaidTransaction: Transaction
): SimpleTransaction {
  return {
    id: plaidTransaction.transaction_id,
    date: plaidTransaction.date,
    amount: plaidTransaction.amount * -1,
    name: plaidTransaction.merchant_name || plaidTransaction.name,
    logo_url: plaidTransaction.logo_url ?? null,
    ignore: false,
  };
}

type SimpleTransaction = {
  id: string;
  date: string;
  amount: number;
  name: string;
  logo_url: string | null;
  ignore: boolean;
};
