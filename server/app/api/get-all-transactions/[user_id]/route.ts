export const dynamic = "force-dynamic"; // defaults to force-static
import { plaidClient, prisma } from "@/helpers";
import { Prisma } from "@prisma/client";

import {
  CounterpartyType,
  PaymentChannel,
  Transaction,
  TransactionPaymentChannelEnum,
  TransactionTransactionTypeEnum,
  TransactionsSyncResponse,
} from "plaid";

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
    const added: Transaction[] = [];
    const modified: Transaction[] = [];
    const removed: Array<{ transaction_id?: string }> = [];
    let nextCursor = item.cursor;
    while (has_more) {
      // const res = await plaidClient.transactionsSync({
      //   access_token: item.plaid_access_token,
      //   cursor: nextCursor ?? undefined,
      // });
      const res: { data: TransactionsSyncResponse } = {
        data: {
          added: [
            {
              account_id: "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
              account_owner: null,
              amount: 20.34,
              iso_currency_code: "USD",
              unofficial_currency_code: null,
              category: ["Food and Drink", "Restaurants", "Fast Food"],
              category_id: "13005032",
              check_number: null,
              counterparties: [
                {
                  name: "DoorDash",
                  type: CounterpartyType.Marketplace,
                  logo_url:
                    "https://plaid-counterparty-logos.plaid.com/doordash_1.png",
                  website: "doordash.com",
                  entity_id: "YNRJg5o2djJLv52nBA1Yn1KpL858egYVo4dpm",
                  confidence_level: "HIGH",
                },
                {
                  name: "Burger King",
                  type: CounterpartyType.Merchant,
                  logo_url:
                    "https://plaid-merchant-logos.plaid.com/burger_king_155.png",
                  website: "burgerking.com",
                  entity_id: "mVrw538wamwdm22mK8jqpp7qd5br0eeV9o4a1",
                  confidence_level: "VERY_HIGH",
                },
              ],
              date: "2023-09-28",
              datetime: "2023-09-28T15:10:09Z",
              authorized_date: "2023-09-27",
              authorized_datetime: "2023-09-27T08:01:58Z",
              location: {
                address: null,
                city: null,
                region: null,
                postal_code: null,
                country: null,
                lat: null,
                lon: null,
                store_number: null,
              },
              name: "Dd Doordash Burgerkin",
              merchant_name: "Burger King",
              merchant_entity_id: "mVrw538wamwdm22mK8jqpp7qd5br0eeV9o4a1",
              logo_url:
                "https://plaid-merchant-logos.plaid.com/burger_king_155.png",
              website: "burgerking.com",
              payment_meta: {
                by_order_of: null,
                payee: null,
                payer: null,
                payment_method: null,
                payment_processor: null,
                ppd_id: null,
                reason: null,
                reference_number: null,
              },
              payment_channel: TransactionPaymentChannelEnum.Online,
              pending: true,
              pending_transaction_id: null,
              personal_finance_category: {
                primary: "FOOD_AND_DRINK",
                detailed: "FOOD_AND_DRINK_FAST_FOOD",
                confidence_level: "VERY_HIGH",
              },
              personal_finance_category_icon_url:
                "https://plaid-category-icons.plaid.com/PFC_FOOD_AND_DRINK.png",
              transaction_id: "yhnUVvtcGGcCKU0bcz8PDQr5ZUxUXebUvbKC0",
              transaction_code: null,
              transaction_type: TransactionTransactionTypeEnum.Digital,
            },
            {
              account_id: "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
              account_owner: null,
              amount: 72.1,
              iso_currency_code: "USD",
              unofficial_currency_code: null,
              category: ["Shops", "Supermarkets and Groceries"],
              category_id: "19046000",
              check_number: null,
              counterparties: [
                {
                  name: "Walmart",
                  type: CounterpartyType.Merchant,
                  logo_url:
                    "https://plaid-merchant-logos.plaid.com/walmart_1100.png",
                  website: "walmart.com",
                  entity_id: "O5W5j4dN9OR3E6ypQmjdkWZZRoXEzVMz2ByWM",
                  confidence_level: "VERY_HIGH",
                },
              ],
              date: "2023-09-24",
              datetime: "2023-09-24T11:01:01Z",
              authorized_date: "2023-09-22",
              authorized_datetime: "2023-09-22T10:34:50Z",
              location: {
                address: "13425 Community Rd",
                city: "Poway",
                region: "CA",
                postal_code: "92064",
                country: "US",
                lat: 32.959068,
                lon: -117.037666,
                store_number: "1700",
              },
              name: "PURCHASE WM SUPERCENTER #1700",
              merchant_name: "Walmart",
              merchant_entity_id: "O5W5j4dN9OR3E6ypQmjdkWZZRoXEzVMz2ByWM",
              logo_url:
                "https://plaid-merchant-logos.plaid.com/walmart_1100.png",
              website: "walmart.com",
              payment_meta: {
                by_order_of: null,
                payee: null,
                payer: null,
                payment_method: null,
                payment_processor: null,
                ppd_id: null,
                reason: null,
                reference_number: null,
              },
              payment_channel: TransactionPaymentChannelEnum.InStore,
              pending: false,
              pending_transaction_id: "no86Eox18VHMvaOVL7gPUM9ap3aR1LsAVZ5nc",
              personal_finance_category: {
                primary: "GENERAL_MERCHANDISE",
                detailed: "GENERAL_MERCHANDISE_SUPERSTORES",
                confidence_level: "VERY_HIGH",
              },
              personal_finance_category_icon_url:
                "https://plaid-category-icons.plaid.com/PFC_GENERAL_MERCHANDISE.png",
              transaction_id: "lPNjeW1nR6CDn5okmGQ6hEpMo4lLNoSrzqDje",
              transaction_code: null,
              transaction_type: TransactionTransactionTypeEnum.Place,
            },
          ],
          modified: [
            {
              account_id: "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
              account_owner: null,
              amount: 28.34,
              iso_currency_code: "USD",
              unofficial_currency_code: null,
              category: ["Food and Drink", "Restaurants", "Fast Food"],
              category_id: "13005032",
              check_number: null,
              counterparties: [
                {
                  name: "DoorDash",
                  type: CounterpartyType.Marketplace,
                  logo_url:
                    "https://plaid-counterparty-logos.plaid.com/doordash_1.png",
                  website: "doordash.com",
                  entity_id: "YNRJg5o2djJLv52nBA1Yn1KpL858egYVo4dpm",
                  confidence_level: "HIGH",
                },
                {
                  name: "Burger King",
                  type: CounterpartyType.Merchant,
                  logo_url:
                    "https://plaid-merchant-logos.plaid.com/burger_king_155.png",
                  website: "burgerking.com",
                  entity_id: "mVrw538wamwdm22mK8jqpp7qd5br0eeV9o4a1",
                  confidence_level: "VERY_HIGH",
                },
              ],
              date: "2023-09-28",
              datetime: "2023-09-28T15:10:09Z",
              authorized_date: "2023-09-27",
              authorized_datetime: "2023-09-27T08:01:58Z",
              location: {
                address: null,
                city: null,
                region: null,
                postal_code: null,
                country: null,
                lat: null,
                lon: null,
                store_number: null,
              },
              name: "Dd Doordash Burgerkin",
              merchant_name: "Burger King",
              merchant_entity_id: "mVrw538wamwdm22mK8jqpp7qd5br0eeV9o4a1",
              logo_url:
                "https://plaid-merchant-logos.plaid.com/burger_king_155.png",
              website: "burgerking.com",
              payment_meta: {
                by_order_of: null,
                payee: null,
                payer: null,
                payment_method: null,
                payment_processor: null,
                ppd_id: null,
                reason: null,
                reference_number: null,
              },
              payment_channel: TransactionPaymentChannelEnum.Online,
              pending: true,
              pending_transaction_id: null,
              personal_finance_category: {
                primary: "FOOD_AND_DRINK",
                detailed: "FOOD_AND_DRINK_FAST_FOOD",
                confidence_level: "VERY_HIGH",
              },
              personal_finance_category_icon_url:
                "https://plaid-category-icons.plaid.com/PFC_FOOD_AND_DRINK.png",
              transaction_id: "yhnUVvtcGGcCKU0bcz8PDQr5ZUxUXebUvbKC0",
              transaction_code: null,
              transaction_type: TransactionTransactionTypeEnum.Digital,
            },
          ],
          removed: [
            // { transaction_id: "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp" },
          ],
          // removed: [
          //   {
          //     transaction_id: "CmdQTNgems8BT1B7ibkoUXVPyAeehT3Tmzk0l",
          //   },
          // ],
          next_cursor:
            "tVUUL15lYQN5rBnfDIc1I8xudpGdIlw9nsgeXWvhOfkECvUeR663i3Dt1uf/94S8ASkitgLcIiOSqNwzzp+bh89kirazha5vuZHBb2ZA5NtCDkkV",
          has_more: false,
          request_id: "Wvhy9PZHQLV8njG",
        },
      };

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

    await prisma.transactions.updateMany({
      where: {
        id: { in: modified.map((i) => i.transaction_id) },
      },
      data: modified.map((t) => createDbTransaction(t, item.id)),
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
