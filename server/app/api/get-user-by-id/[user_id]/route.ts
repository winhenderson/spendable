export const dynamic = "force-dynamic"; // defaults to force-static
import { plaidClient, prisma } from "@/helpers";
import { CountryCode } from "plaid";

export async function GET(
  request: Request,
  { params }: { params: { user_id: string } }
) {
  const user_id = params.user_id;

  const dbResult = await prisma.public_users.findFirst({
    select: {
      id: true,
      amount: true,
      email: true,
      items: {
        select: {
          id: true,
          plaid_access_token: true,
          transactions: {
            select: {
              id: true,
              transaction_date: true,
              amount: true,
              name: true,
            },
          },
        },
      },
      months: {
        select: { date: true, amount: true },
      },
    },
    where: { auth_id: user_id },
  });

  if (!dbResult) {
    throw new Error(`bad request: ${user_id} `);
  }

  const banks: Array<BankInfo> = [];
  for (const item of dbResult.items) {
    const itemInfo = await plaidClient.itemGet({
      access_token: item.plaid_access_token,
    });

    if (!itemInfo.data.item.institution_id) {
      return;
    }

    const institutionInfo = await plaidClient.institutionsGetById({
      institution_id: itemInfo.data.item.institution_id,
      country_codes: [CountryCode.Us],
    });

    const institution = institutionInfo.data.institution;

    banks.push({
      id: item.id,
      name: institution.name,
      logo: institution.logo ?? null,
      primary_color: institution.primary_color ?? null,
    });
  }

  const monthsMap: Record<string, number> = {};
  for (const month of dbResult.months) {
    monthsMap[month.date] = Number(month.amount);
  }

  const user = {
    banks: banks,
    transactions: dbResult.items
      .map((i) =>
        i.transactions.map((t) => {
          return {
            id: t.id,
            date: t.transaction_date,
            amount: Number(t.amount),
            name: t.name,
          };
        })
      )
      .flat(),
    id: dbResult.id,
    defaultSpendable: dbResult.amount ? Number(dbResult.amount) : null,
    email: dbResult.email,
    months: monthsMap,
  };

  if (!user) {
    throw new Error("Invalid credentials");
  }

  return Response.json(user);
}

type BankInfo = {
  id: string;
  name: string;
  logo: string | null;
  primary_color: string | null;
};
