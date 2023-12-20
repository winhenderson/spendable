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

  //TODO: also send the auth id from session.id in the res ^^
  // query for the user id that corresponds to the session id and use that usir id in the create vv
  await prisma.items.create({
    data: {
      plaid_access_token: res.data.access_token,
      id: res.data.item_id,
    },
  });

  return Response.json(true);
}
