import { LinkTokenCreateResponse } from "plaid";
import invariant from "tiny-invariant";

export async function createLinkToken(): Promise<
  LinkTokenCreateResponse["link_token"]
> {
  invariant(typeof process.env.EXPO_PUBLIC_API_ENDPOINT === "string");
  console.log("is the problem here?!!");
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_ENDPOINT}/create-link-token`,
    { method: "POST" }
  );
  const json = await res.json();
  return json.token.link_token;
}

export async function publicTokenExchange(publicToken: string) {
  console.log("in the public exchange");
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_ENDPOINT}/public-token-exchange`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_token: publicToken }),
    }
  );
  console.log({ res });
}
