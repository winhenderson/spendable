import { prisma } from "@/helpers";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic"; // defaults to force-static

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.item_id || !body.title || !body.amount || body.date) {
    console.error("a field is missing in the create-new-transaction request");
    return;
  }

  await prisma.transactions.create({
    data: {
      transaction_date: body.date,
      name: body.name,
      amount: body.amount,
      item_id: body.item_id,
      pending: false,
      id: randomUUID(),
    },
  });
  // invariant(typeof process.env.PLAID_CLIENT_ID === "string");
  // const tokenResponse = await plaidClient.linkTokenCreate({
  //   user: { client_user_id: process.env.PLAID_CLIENT_ID },
  //   client_name: "Spendable Budgeting",
  //   language: "en",
  //   products: [Products.Transactions],
  //   country_codes: [CountryCode.Us],
  //   redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
  // });
  // return Response.json({
  //   token: tokenResponse.data,
  // });
}
