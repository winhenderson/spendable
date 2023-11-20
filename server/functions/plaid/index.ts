import { plaid } from "../../deps.ts";
import {
  SupabaseClient,
  createClient,
} from "npm:@supabase/supabase-js@^2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
};

const configuration = new plaid.Configuration({
  basePath: plaid.PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": Deno.env.get("PLAID_CLIENT_ID"),
      "PLAID-SECRET": Deno.env.get("PLAID_SECRET"),
    },
  },
});

const client = new plaid.PlaidApi(configuration);

async function getAllCatNames(supabaseClient: SupabaseClient) {
  const { data: catNames, error } = await supabaseClient
    .from("testing")
    .select("cat_name");
  if (error) throw error;

  return new Response(JSON.stringify({ catNames }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

Deno.serve(async (req) => {
  const { url, method } = req;
  if (method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // switch (true) {
    //   case method === "GET":
    return getAllCatNames(supabaseClient);
    // }
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
  // const { name } = await req.json();
  // const data = {
  //   message: `Hello ${name}!`,
  // };

  // return new Response(JSON.stringify(data), {
  //   headers: { "Content-Type": "application/json" },
  // });
});

// To invoke:
// curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
