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

import { useEffect, useState } from "react";
import "react-native-url-polyfill/auto";

import { PlaidLink, LinkSuccess, LinkExit } from "react-native-plaid-link-sdk";
import invariant from "tiny-invariant";

export default function App() {
  const [catNames, setCatNames] = useState<string[]>();

  return (
    <SafeAreaView style={tw`bg-teal-800 items-center justify-center flex grow`}>
      <StatusBar style="dark" />
      <FlatList
        data={catNames}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
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
            invariant(typeof process.env.EXPO_PUBLIC_API_ENDPOINT === "string");
            const res = await fetch(process.env.EXPO_PUBLIC_API_ENDPOINT);
            const json = await res.json();
            setCatNames(json.cat_names);
          }}
        >
          <Text style={tw`text-white font-bold uppercase`}>Add Account</Text>
        </Pressable>
      </PlaidLink>
      {/* <Button title={"Delete Sallies"} onPress={() => deleteCat("sally")} /> */}
    </SafeAreaView>
  );
}
