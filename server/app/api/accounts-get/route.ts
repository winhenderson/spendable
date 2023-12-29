export const dynamic = "force-dynamic"; // defaults to force-static
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
  if (!body.user_id) {
    throw new Error("no user_id in request body of accounts-get");
  }

  const items = await prisma.items.findMany({
    where: { user_id: body.user_id },
  });

  let info: { name: string; officialName: string | null }[] = [];

  for (const item of items) {
    const accountsInfo = await plaidClient.accountsGet({
      access_token: item.plaid_access_token,
    });

    info = info.concat(
      accountsInfo.data.accounts.map((i) => {
        return { name: i.name, officialName: i.official_name };
      })
    );
  }

  return Response.json(info);
}
