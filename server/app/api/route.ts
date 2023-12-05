export const dynamic = "force-dynamic"; // defaults to force-static
import invariant from "tiny-invariant";
import { PrismaClient } from "@prisma/client";

import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from "plaid";

const prisma = new PrismaClient();

const plaidClient = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments["sandbox"],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
        "PLAID-SECRET": process.env.PLAID_SECRET,
        "Plaid-Version": "2020-09-14",
      },
    },
  })
);

export async function GET() {
  const data = await prisma.cats.findMany();
  invariant(typeof process.env.PLAID_CLIENT_ID === "string");
  const tokenResponse = await plaidClient.linkTokenCreate({
    user: { client_user_id: process.env.PLAID_CLIENT_ID },
    client_name: "Plaid's Tiny Quickstart",
    language: "en",
    products: [Products.Transactions],
    country_codes: [CountryCode.Us],
    redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
  });

  return Response.json({
    token: tokenResponse.data,
    cat_names: data.map((i) => i.cat_name),
  });
}
