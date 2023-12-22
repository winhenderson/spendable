import { LinkTokenCreateResponse } from "plaid";
import invariant from "tiny-invariant";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export async function publicTokenExchange(
  publicToken: string,
  sessionId: string
) {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_ENDPOINT}/public-token-exchange`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_token: publicToken }),
    }
  );
}

export async function transactionsSync(
  user_id: string
): Promise<Array<SimpleTransaction>> {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_ENDPOINT}/transactions-sync`,
    { method: "POST", body: JSON.stringify({ id: user_id }) }
  );
  const json = await res.json();
  return json;
}

export async function findUserByEmail(email: string): Promise<{
  email: string;
}> {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_ENDPOINT}/find-user-by-email`,
    {
      method: "POST",
      body: JSON.stringify({ email: String(email).toLowerCase() }),
    }
  );
  const json = await res.json();
  return json;
}

export async function signUp(email: string, id: string) {
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_ENDPOINT}/sign-up`, {
    method: "POST",
    body: JSON.stringify({ email, id }),
  });
}

export type SimpleTransaction = {
  id: string;
  date: string;
  amount: number;
  name: string;
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
