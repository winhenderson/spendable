import plaid, {
  LinkTokenCreateRequest,
  SandboxPublicTokenCreateRequest,
} from "https://esm.sh/plaid@16.0.0?target=deno";
import {
  SupabaseClient,
  createClient,
} from "https://esm.sh/@supabase/supabase-js@2";
// import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

// const env = await load();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
};

const configuration = new plaid.Configuration({
  basePath: plaid.PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      // "PLAID-CLIENT-ID": env["PLAID_CLIENT_ID"],
      // "PLAID-SECRET": env["PLAID_SECRET"],
      PLAID_CLIENT_ID: "6557853b76f49a001b64faf1",
      PLAID_SECRET: "e86e4bfd3ebdc7746f30fef8b88e2b",
    },
  },
});

console.log("base options", configuration.baseOptions);
const client = new plaid.PlaidApi(configuration);

Deno.serve(async (req) => {
  const request: SandboxPublicTokenCreateRequest = {
    client_id: "6557853b76f49a001b64faf1",
    secret: "e86e4bfd3ebdc7746f30fef8b88e2b",
    institution_id: "ins_109508",
    initial_products: [plaid.Products.Transactions],
    // user: {
    //   client_user_id: "6557853b76f49a001b64faf1",
    // },
    // products: [plaid.Products.Transactions, plaid.Products.Auth],
    // client_name: "Spendable Dev",
    // language: "en",
    // country_codes: [plaid.CountryCode.Us],
  };

  console.log("in here");
  try {
    console.log("why am i not here?", { request });
    const createTokenResponse = await client.sandboxPublicTokenCreate(request);
    console.log("should be here", { createTokenResponse });
    return new Response(JSON.stringify(createTokenResponse.data), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("here?", error);

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

// To invoke:
// curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-link-token' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
// --data '{"name":"Functions"}'
