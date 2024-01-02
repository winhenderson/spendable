import { PrismaClient } from "@prisma/client";
import { PlaidApi, Configuration, PlaidEnvironments } from "plaid";

export const prisma = new PrismaClient();

export const plaidClient = new PlaidApi(
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
