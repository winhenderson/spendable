export const dynamic = "force-dynamic"; // defaults to force-static
import invariant from "tiny-invariant";
import { PrismaClient } from "@prisma/client";

import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

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

export async function POST(request: Request) {
  const body = await request.json();
  invariant(typeof process.env.PLAID_CLIENT_ID === "string");
  const res = await plaidClient.itemPublicTokenExchange({
    public_token: body.public_token,
  });

  await prisma.items.create({
    data: {
      plaid_access_token: res.data.access_token,
      plaid_item_id: res.data.item_id,
    },
  });

  return Response.json(true);
}
