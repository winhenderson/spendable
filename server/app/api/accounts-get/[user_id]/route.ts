export const dynamic = "force-dynamic"; // defaults to force-static
import { plaidClient, prisma } from "@/helpers";
import { CountryCode, InstitutionsGetByIdResponse } from "plaid";

type BankInfo = {
  name: string;
  officialName: string | null;
  logo: string | null;
  primary_color: string | null;
};

export async function GET(
  request: Request,
  { params }: { params: { user_id: string } }
) {
  console.log("get-user-by-id got called");
  const user_id = params.user_id;

  const items = await prisma.items.findMany({
    where: { user_id: user_id },
  });

  let info: Array<BankInfo> = [];
  for (const item of items) {
    const itemInfo = await plaidClient.itemGet({
      access_token: item.plaid_access_token,
    });
    // const accountsInfo = await plaidClient.accountsGet({
    //   access_token: item.plaid_access_token,
    // });

    let institutionDetails: InstitutionsGetByIdResponse | null = null;
    if (itemInfo.data.item.institution_id) {
      const res = await plaidClient.institutionsGetById({
        institution_id: itemInfo.data.item.institution_id,
        country_codes: [CountryCode.Us],
      });
      institutionDetails = res.data;
    }

    // info.push({name: itemInfo.data.item.})

    // info = info.concat(
    //   accountsInfo.data.accounts.map((i) => {
    //     return {
    //       name: i.name,
    //       officialName: i.official_name,
    //       logo: institutionDetails?.institution.logo ?? null,
    //       primary_color: institutionDetails?.institution.primary_color ?? null,
    //     };
    //   })
    // );
  }

  return Response.json(info);
}
