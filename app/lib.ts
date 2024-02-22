import { LinkTokenCreateResponse } from "plaid";
import invariant from "tiny-invariant";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const endpoint = process.env.EXPO_PUBLIC_API_ENDPOINT;

export async function createLinkToken(
  bank_id?: string
): Promise<LinkTokenCreateResponse["link_token"]> {
  invariant(typeof process.env.EXPO_PUBLIC_API_ENDPOINT === "string");
  const res = await fetch(`${endpoint}/create-link-token`, {
    method: "POST",
    body: JSON.stringify({ bank_id: bank_id }),
  });
  const json = await res.json();
  return json.token.link_token;
}

export async function deleteAccount(user_id: string) {
  await fetch(`${endpoint}/delete-account/${user_id}`, { method: "POST" });
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

export async function getAllTransactions(user_id: string): APIResponse<{
  transactions: Array<SimpleTransaction>;
  loggedOutBanks: Array<string>;
}> {
  try {
    const res = await fetch(`${endpoint}/get-all-transactions/${user_id}`);

    const json = await res.json();
    return { ok: true, value: json };
  } catch (error) {
    console.error("Error in getAllTransactions", error);
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
  try {
    const res = await fetch(`${endpoint}/sign-up`, {
      method: "POST",
      body: JSON.stringify({ email, id }),
    });

    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Error in signUp: ", error);
    return { ok: false, error };
  }
}

export async function updateDefaultAmount(newAmount: number, userId: string) {
  await fetch(`${endpoint}/update-default-amount/${userId}`, {
    method: "POST",
    body: JSON.stringify({ newAmount }),
  });
}

export async function updateMonthAmount(
  newAmount: number,
  userId: string,
  month: number,
  year: number
) {
  await fetch(`${endpoint}/update-month-amount/${userId}/${year}/${month}`, {
    method: "POST",
    body: JSON.stringify({ newAmount }),
  });
}

export async function getUserById(
  user_id: string,
  attemptNumber = 0
): APIResponse<User> {
  try {
    const res = await fetch(`${endpoint}/get-user-by-id/${user_id}`);

    const json = await res.json();
    return { ok: true, value: json };
  } catch (error) {
    // Fixes race condition on sign in when database hasn't updated before the get_user_by_id asks for that user
    if (attemptNumber < 4) {
      const nextAttempt = attemptNumber + 1;
      await new Promise((resolve) => setTimeout(resolve, 200 * nextAttempt));
      console.warn("retrying");
      return getUserById(user_id, nextAttempt);
    }
    console.error("Error in getUserById", error);
    return { ok: false, error };
  }
}

export async function createTransaction(
  item_id: string,
  title: string,
  date: string,
  amount: number
) {
  await fetch(`${endpoint}/create-transaction`, {
    method: "POST",
    body: JSON.stringify({ item_id, title, date, amount }),
  });
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
  defaultSpendable: number;
  transactions: SimpleTransaction[];
  months: Record<string, number>;
  banks: BankTitle[];
  loggedOutBanks: string[];
};

export type ColorScheme = "light" | "dark" | "system";

export type BankTitle = {
  id: string;
  name: string;
  logo: string | null;
  primary_color: string | null;
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
