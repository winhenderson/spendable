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

export async function publicTokenExchange(
  publicToken: string,
  user_id: string
) {
  await fetch(`${endpoint}/public-token-exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_token: publicToken, user_id }),
  });
}

export async function getMonthTransactions(
  user_id: string,
  year: number,
  month: number
): APIResponse<Array<SimpleTransaction>> {
  try {
    const res = await fetch(
      `${endpoint}/get-month-transactions/${year}/${month}/${user_id}`
    );

    const json: Array<SimpleTransaction> = await res.json();
    // console.log({ json });
    return { ok: true, value: json };
  } catch (error) {
    console.error(error);
    return { ok: false, error };
  }
}

export async function getAllTransactions(
  user_id: string
): APIResponse<Array<SimpleTransaction>> {
  try {
    const res = await fetch(`${endpoint}/get-all-transactions/${user_id}`);

    const json: Array<SimpleTransaction> = await res.json();
    // console.log({ json });
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

export async function ignore(
  transaction_id: string,
  user_id: string
): Promise<boolean> {
  const res = await fetch(`${endpoint}/ignore`, {
    method: "POST",
    body: JSON.stringify({ transaction_id, user_id }),
  });

  if (res.status === 404) {
    return false;
  }
  return true;
}

export async function signUp(email: string, id: string): APIResponse<User> {
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
  ignore: boolean;
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

export function isCurrentMonth(date: Date): boolean {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
    return true;
  }
  return false;
}
