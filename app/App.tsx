import { StatusBar } from "expo-status-bar";
import {
  Button,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import tw from "twrnc";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import "react-native-url-polyfill/auto";

import { PlaidLink, LinkSuccess, LinkExit } from "react-native-plaid-link-sdk";
import { Database } from "./types/supabase";

// const supabaseUrl = "https://bcvsroiksgzgiqmjzvyn.supabase.co";
const supabaseUrl = "http://192.168.10.220:54321";
// const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY ?? "";
const supabaseKey = process.env.EXPO_PUBLIC_SERVICE_ROLE_KEY ?? "";
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default function App() {
  const [catNames, setCatNames] =
    useState<
      Array<Database["public"]["Tables"]["testing"]["Row"]["cat_name"]>
    >();

  useEffect(() => {
    // getCatNames();
    // addCat("sally");
  }, []);

  async function getCatNames() {
    const { data, error } = await supabase.from("cats").select("cat_name");
    if (error) {
      console.error({ error });
    }

    setCatNames(data?.map((value) => value.cat_name));
  }

  async function addCat(name: string) {
    const { error } = await supabase.from("cats").insert({ cat_name: name });
    if (error) {
      console.error({ error });
    }

    getCatNames();
  }

  async function deleteCat(name: string) {
    const { error } = await supabase.from("cats").delete().eq("cat_name", name);
    getCatNames();
  }

  return (
    <SafeAreaView style={tw`bg-teal-800 items-center justify-center flex grow`}>
      <StatusBar style="dark" />
      {/* <FlatList
        data={catNames}
        renderItem={({ item }) => <Text>{item}</Text>}
      /> */}
      <PlaidLink
        tokenConfig={{
          token: "#GENERATED_LINK_TOKEN#",
          noLoadingState: false,
        }}
        onSuccess={(success: LinkSuccess) => console.log(success)}
        onExit={(exit: LinkExit) => console.log(exit)}
      >
        <Pressable
          style={tw`bg-orange-600 p-4 rounded-full`}
          onPress={async () => {
            const { data, error } = await supabase.functions.invoke(
              "create-link-token"
            );
            // console.log(res);
            console.log({ data, error });
          }}
        >
          <Text style={tw`text-white font-bold uppercase`}>Add Account</Text>
        </Pressable>
      </PlaidLink>
      {/* <Button title={"Delete Sallies"} onPress={() => deleteCat("sally")} /> */}
    </SafeAreaView>
  );
}
