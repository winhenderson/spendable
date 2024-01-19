export const dynamic = "force-dynamic"; // defaults to force-static
import { plaidClient, prisma } from "@/helpers";
import { CountryCode, InstitutionsGetByIdResponse } from "plaid";

export async function GET(
  request: Request,
  { params }: { params: { user_id: string } }
) {
  console.log("get-user-by-id got called");
  const user_id = params.user_id;

  const items = await prisma.items.findMany({
    where: { user_id: user_id },
  });

  let info: {
    name: string;
    officialName: string | null;
    logo: string | null;
  }[] = [];

  for (const item of items) {
    const accountsInfo = await plaidClient.accountsGet({
      access_token: item.plaid_access_token,
    });

    let institutionDetails: InstitutionsGetByIdResponse | null = null;
    if (accountsInfo.data.item.institution_id) {
      const res = await plaidClient.institutionsGetById({
        institution_id: accountsInfo.data.item.institution_id,
        country_codes: [CountryCode.Us],
      });
      institutionDetails = res.data;
    }

    info = info.concat(
      accountsInfo.data.accounts.map((i) => {
        return {
          name: i.name,
          officialName: i.official_name,
          logo: institutionDetails?.institution.logo ?? null,
        };
      })
    );
  }

  return Response.json(info);
}
