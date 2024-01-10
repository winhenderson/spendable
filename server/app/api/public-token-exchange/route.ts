export const dynamic = "force-dynamic"; // defaults to force-static
import invariant from "tiny-invariant";

import { plaidClient, prisma } from "@/helpers";

export async function POST(request: Request) {
  const body = await request.json();
  invariant(typeof process.env.PLAID_CLIENT_ID === "string");

  const res = await plaidClient.itemPublicTokenExchange({
    public_token: body.public_token,
  });

  //TODO: also send the auth id from session.id in the res ^^
  // query for the user id that corresponds to the session id and use that usir id in the create vv
  // const user = await prisma.public_users.findFirst({
  //   where: { auth_id: body.user_id },
  // });

  // if (!user) {
  //   throw new Error("invalid credentials");
  // }

  await prisma.items.create({
    data: {
      plaid_access_token: res.data.access_token,
      id: res.data.item_id,
      user_id: body.user_id,
    },
  });

  return Response.json(true);
}
