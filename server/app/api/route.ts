export const dynamic = "force-dynamic"; // defaults to force-static

import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from "plaid";

const plaidClient = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments["sandbox"],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": "6557853b76f49a001b64faf1",
        "PLAID-SECRET": "e86e4bfd3ebdc7746f30fef8b88e2b",
        "Plaid-Version": "2020-09-14",
      },
    },
  })
);

export async function GET() {
  const tokenResponse = await plaidClient.linkTokenCreate({
    user: { client_user_id: "6557853b76f49a001b64faf1" },
    client_name: "Plaid's Tiny Quickstart",
    language: "en",
    products: [Products.Transactions],
    country_codes: [CountryCode.Us],
    redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
  });

  return Response.json(tokenResponse.data);
}
