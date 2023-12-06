import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";
import tw from "twrnc";

import { useCallback, useEffect, useState } from "react";
import "react-native-url-polyfill/auto";

import { PlaidLink, LinkSuccess, LinkExit } from "react-native-plaid-link-sdk";
import { createLinkToken, publicTokenExchange } from "./lib";

export default function App() {
  const [linkToken, setLinkToken] = useState<string>();

  const createNewLinkToken = useCallback(async () => {
    const token = await createLinkToken();
    setLinkToken(token);
  }, [setLinkToken]);

  useEffect(() => {
    if (linkToken === undefined) {
      createNewLinkToken();
    }
  }, [linkToken]);

  // TODO: make this better
  if (!linkToken) {
    return;
  }

  return (
    <SafeAreaView
      style={tw`bg-teal-800 items-center justify-center flex grow p-1`}
    >
      <StatusBar style="dark" />
      <PlaidLink
        onPress={() => console.log("in here")}
        tokenConfig={{
          token: linkToken,
          noLoadingState: false,
        }}
        onSuccess={(success: LinkSuccess) => {
          publicTokenExchange(success.publicToken);
        }}
        onExit={(exit: LinkExit) => console.log(exit)}
      >
        <Text
          style={tw`bg-orange-600 p-4 text-white font-bold uppercase overflow-hidden rounded-2xl`}
        >
          Add Account
        </Text>
      </PlaidLink>
    </SafeAreaView>
  );
}
