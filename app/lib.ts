import { LinkTokenCreateResponse } from "plaid";
import invariant from "tiny-invariant";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const endpoint = process.env.EXPO_PUBLIC_API_ENDPOINT;

export async function createLinkToken(): Promise<
  LinkTokenCreateResponse["link_token"]
> {
  invariant(typeof process.env.EXPO_PUBLIC_API_ENDPOINT === "string");
  const res = await fetch(`${endpoint}/create-link-token`, { method: "POST" });
  const json = await res.json();
  return json.token.link_token;
}

export async function publicTokenExchange(publicToken: string) {
  await fetch(`${endpoint}/public-token-exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_token: publicToken }),
  });
}

export async function transactionsSync(
  user_id: string
): APIResponse<Array<SimpleTransaction>> {
  try {
    const res = await fetch(`${endpoint}/transactions-sync/${user_id}`);

    const json = await res.json();
    return { ok: true, value: json };
  } catch (error) {
    console.error(error);
    return { ok: false, error };
  }
}

export async function accountsGet(
  user_id: string
): APIResponse<Array<BankTitle>> {
  // TODO: should this be more secure
  try {
    const res = await fetch(`${endpoint}/accounts-get/${user_id}`);

    const json = await res.json();
    return { ok: true, value: json };
  } catch (error) {
    console.error(error);
    return { ok: false, error };
  }
}

export async function signUp(email: string, id: string): Promise<User> {
  // TODO: add some tests to this file
  const res = await fetch(`${endpoint}/sign-up`, {
    method: "POST",
    body: JSON.stringify({ email, id }),
  });

  const json = await res.json();
  return json;
}

export async function updateAmount(newAmount: number, userId: string) {
  await fetch(`${endpoint}/update-amount`, {
    method: "POST",
    body: JSON.stringify({ newAmount, userId }),
  });
}

export async function getUserById(user_id: string): APIResponse<User> {
  try {
    const res = await fetch(`${endpoint}/get-user-by-id/${user_id}`);

    const json = await res.json();
    return { ok: true, value: json };
  } catch (error) {
    console.error(error);
    return { ok: false, error };
  }
}

type APIResponse<T> = Promise<
  { ok: true; value: T } | { ok: false; error: unknown }
>;

export type SimpleTransaction = {
  id: string;
  date: string;
  amount: number;
  name: string;
  logo_url: string | null;
};

export type User = {
  id: string;
  email: string;
  amount: number;
  transactions: SimpleTransaction[];
};

export type ColorScheme = "light" | "dark";

export type BankTitle = {
  name: string;
  officialName: string | null;
  logo: string | null;
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
