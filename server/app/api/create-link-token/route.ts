export const dynamic = "force-dynamic"; // defaults to force-static
import invariant from "tiny-invariant";

import { CountryCode, LinkTokenCreateRequest, Products } from "plaid";
import { plaidClient, prisma } from "@/helpers";

// update this function so it takes an optional bank_id. THen ask prisma for the corresponding access token for that bank_id and pass the access token to the linkTokenCreate request below, to get a link token that will hopefully trigger an update mode PlaidLink thing.

export async function POST(request: Request) {
  invariant(typeof process.env.PLAID_CLIENT_ID === "string");
  const requestConfig: LinkTokenCreateRequest = {
    user: { client_user_id: process.env.PLAID_CLIENT_ID },
    client_name: "Spendable Budgeting",
    language: "en",
    products: [Products.Transactions],
    country_codes: [CountryCode.Us],
    redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
  };

  const body = await request.json();
  if (typeof body.bank_id === "string") {
    const dbRes = await prisma.items.findFirst({
      select: { plaid_access_token: true },
      where: { id: body.bank_id },
    });
    if (!dbRes) {
      throw new Error(
        "failed to get access token for bank in createLinkToken()"
      );
    }

    requestConfig.access_token = dbRes.plaid_access_token;
  }
  const tokenResponse = await plaidClient.linkTokenCreate(requestConfig);

  return Response.json({
    token: tokenResponse.data,
  });
}
