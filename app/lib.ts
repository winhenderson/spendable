import {
  LinkTokenCreateResponse,
  Transaction,
  TransactionsSyncResponse,
} from "plaid";
import invariant from "tiny-invariant";

export async function createLinkToken(): Promise<
  LinkTokenCreateResponse["link_token"]
> {
  invariant(typeof process.env.EXPO_PUBLIC_API_ENDPOINT === "string");
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_ENDPOINT}/create-link-token`,
    { method: "POST" }
  );
  const json = await res.json();
  return json.token.link_token;
}

export async function publicTokenExchange(publicToken: string) {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_ENDPOINT}/public-token-exchange`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_token: publicToken }),
    }
  );
}

export async function transactionsSync(): Promise<Array<SimpleTransaction>> {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_ENDPOINT}/transactions-sync`
  );
  const json = await res.json();
  return json;
}

export type SimpleTransaction = {
  id: string;
  date: string;
  amount: number;
  name: string;
};
