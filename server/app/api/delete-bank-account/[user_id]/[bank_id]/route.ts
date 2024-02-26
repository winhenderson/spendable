export const dynamic = "force-dynamic"; // defaults to force-static

import { prisma, plaidClient } from "@/helpers";

export async function POST(
  req: Request,
  { params }: { params: { user_id: string; bank_id: string } }
) {
  const user_id = params.user_id;
  const bank_id = params.bank_id;

  const userInfo = await prisma.public_users.findFirst({
    where: { id: user_id },
    select: {
      auth_id: true,
      items: { select: { plaid_access_token: true }, where: { id: bank_id } },
    },
  });

  if (!userInfo || !userInfo.auth_id) {
    throw new Error(
      `Unable to find user info for user ${user_id} in deleteBankAccount()`
    );
  }

  if (userInfo.items.length !== 1) {
    throw new Error(
      "unexpected number of bank accounts found, either 0 or more than 1 in deleteBankAccount()"
    );
  }
  for (const item of userInfo.items) {
    try {
      plaidClient.itemRemove({ access_token: item.plaid_access_token });
    } catch (error) {
      console.error("in deleteAccount()", error);
    }
  }

  await prisma.items.delete({ where: { id: bank_id } });
  return Response.json(true);
}
