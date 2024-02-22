export const dynamic = "force-dynamic"; // defaults to force-static

import { prisma } from "@/helpers";

export async function POST(
  req: Request,
  { params }: { params: { user_id: string } }
) {
  const user_id = params.user_id;

  const authId = await prisma.public_users.findFirst({
    where: { id: user_id },
    select: { auth_id: true },
  });

  if (!authId || !authId.auth_id) {
    throw new Error(
      `Unable to find auth_id for user ${user_id} in deleteAccount()`
    );
  }

  await prisma.auth_users.delete({ where: { id: authId.auth_id } });
  return Response.json(true);
}
