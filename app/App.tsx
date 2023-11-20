import { StatusBar } from "expo-status-bar";
import { FlatList, Text, View } from "react-native";
import tw from "twrnc";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import "react-native-url-polyfill/auto";

import { PlaidLink, LinkSuccess, LinkExit } from "react-native-plaid-link-sdk";
import { Database } from "./types/supabase";

const supabaseUrl = "https://bcvsroiksgzgiqmjzvyn.supabase.co";
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY ?? "";
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default function App() {
  const [catNames, setCatNames] =
    useState<
      Array<Database["public"]["Tables"]["testing"]["Row"]["cat_name"]>
    >();

  useEffect(() => {
    getCatNames();
  }, []);

  async function getCatNames() {
    const { data, error } = await supabase.from("testing").select("cat_name");
    setCatNames(data?.map((value) => value.cat_name));
  }

  return (
    <View style={tw`bg-teal-800 items-center justify-center flex grow pt-14`}>
      <StatusBar style="dark" />
      {/* <FlatList
        data={catNames}
        renderItem={({ item }) => <Text>{item}</Text>}
      /> */}
      <PlaidLink
        tokenConfig={{ token: "#GENERATED_LINK_TOKEN#", noLoadingState: false }}
        onSuccess={(success: LinkSuccess) => console.log(success)}
        onExit={(exit: LinkExit) => console.log(exit)}
      >
        <Text>Add Account</Text>
      </PlaidLink>
    </View>
  );
}
