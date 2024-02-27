export const dynamic = "force-dynamic"; // defaults to force-static
import { plaidClient, prisma } from "@/helpers";
import { Prisma } from "@prisma/client";

import { Transaction } from "plaid";

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

  const addNewTransactionsResponse = await addNewTransactions(items);
  allTransactions = allTransactions.concat(
    addNewTransactionsResponse.transactions
  );

  const res = Response.json({
    transactions: allTransactions,
    loggedOutBanks: addNewTransactionsResponse.loggedOutBanks,
  });
  return res;
}

async function addNewTransactions(items: Array<Item>): Promise<{
  transactions: Array<SimpleTransaction>;
  loggedOutBanks: Array<string>;
}> {
  const allTransactions: Record<string, SimpleTransaction> = {};
  const loggedOutBanks: Array<string> = [];
  for (const item of items) {
    if (!item?.plaid_access_token) {
      throw new Error("No access token");
    }

    let has_more = true;
    const added: Transaction[] = [];
    const modified: Transaction[] = [];
    const removed: Array<{ transaction_id?: string }> = [];
    let nextCursor = item.cursor;
    while (has_more) {
      try {
        var res = await plaidClient.transactionsSync({
          access_token: item.plaid_access_token,
          cursor: nextCursor ?? undefined,
        });
      } catch (error) {
        const errorCode = (error as any)?.response?.data?.error_code;
        if (typeof errorCode === "string") {
          loggedOutBanks.push(item.id);
          has_more = false;
          continue;
        } else {
          throw error;
        }
      }

      has_more = res.data.has_more;
      added.push(...res.data.added);

      removed.push(...res.data.removed);

      modified.push(...res.data.modified);

      nextCursor = res.data.next_cursor;
    }

    const transactions = added.map((transaction) =>
      convertPlaidTransaction(transaction)
    );

    await prisma.items.update({
      data: { cursor: nextCursor },
      where: { id: item.id },
    });

    await prisma.transactions.createMany({
      data: added.map((t) => createDbTransaction(t, item.id)),
      skipDuplicates: true,
    });

    await prisma.transactions.deleteMany({
      where: {
        id: { in: removed.map((i) => i.transaction_id ?? "") },
      },
    });

    await Promise.all(
      modified.map((transaction) =>
        prisma.transactions.update({
          where: { id: transaction.transaction_id },
          data: createDbTransaction(transaction, item.id),
        })
      )
    );

    transactions.forEach((t) => (allTransactions[t.id] = t));
    modified.forEach(
      (m) => (allTransactions[m.transaction_id] = convertPlaidTransaction(m))
    );
  }

  return { transactions: Object.values(allTransactions), loggedOutBanks };
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
    transaction_date: plaidTransaction.date,
    amount: new Prisma.Decimal(plaidTransaction.amount * -1),
    merchant_name: plaidTransaction.merchant_name ?? null,
    pending: plaidTransaction.pending,
    logo_url: plaidTransaction.logo_url ?? null,
    name: plaidTransaction.name,
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
