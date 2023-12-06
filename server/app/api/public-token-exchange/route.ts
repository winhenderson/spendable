export const dynamic = "force-dynamic"; // defaults to force-static
import invariant from "tiny-invariant";
import { PrismaClient } from "@prisma/client";

import {
  Configuration,
  ItemPublicTokenExchangeRequest,
  PlaidApi,
  PlaidEnvironments,
} from "plaid";

const prisma = new PrismaClient();

console.log("am i in here?");
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

export async function POST(request) {
  console.log("in here 123");
  // const publicToken = await request.json();
  // console.log("public token is ", publicToken);
  invariant(typeof process.env.PLAID_CLIENT_ID === "string");
  const res = await plaidClient.itemPublicTokenExchange({
    public_token: request.body.public_token,
  });

  console.log("before");
  // prisma.items.create({
  //   data: {
  //     plaid_access_token: res.data.access_token,
  //     plaid_item_id: res.data.item_id,
  //   },
  // });
  console.log("finished");
}
