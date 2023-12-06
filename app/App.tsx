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

import { useCallback, useEffect, useState } from "react";
import "react-native-url-polyfill/auto";

import {
  PlaidLink,
  LinkSuccess,
  LinkExit,
  LinkLogLevel,
} from "react-native-plaid-link-sdk";
import invariant from "tiny-invariant";
import { createLinkToken, publicTokenExchange } from "./lib";

export default function App() {
  const [linkToken, setLinkToken] = useState<string>();

  const createNewLinkToken = useCallback(async () => {
    console.log("*********** ***is this tht eproble,");
    const token = await createLinkToken();
    setLinkToken(token);
  }, [setLinkToken]);

  // async function onSuccess(success: LinkSuccess) {
  //   const accessToken = await publicTokenExchange(success.publicToken);
  // }

  useEffect(() => {
    if (linkToken === undefined) {
      createNewLinkToken();
    }
  }, [linkToken]);
  console.log({ linkToken });
  if (!linkToken) {
    return;
  }

  return (
    <SafeAreaView
      style={tw`bg-teal-800 items-center justify-center flex grow p-1`}
    >
      <StatusBar style="dark" />
      <PlaidLink
        logLevel={LinkLogLevel.DEBUG}
        onPress={() => console.log("in here")}
        tokenConfig={{
          token: linkToken,
          noLoadingState: false,
        }}
        onSuccess={(success: LinkSuccess) => {
          console.log("in here...");

          publicTokenExchange(success.publicToken);
          // createNewLinkToken();
        }}
        onExit={(exit: LinkExit) => console.log(exit)}
      >
        <Text
          style={tw`bg-orange-600 p-4 rounded-full text-white font-bold uppercase`}
        >
          Add Account
        </Text>
      </PlaidLink>
    </SafeAreaView>
  );
}
