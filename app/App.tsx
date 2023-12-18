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

import { PlaidLink, LinkSuccess, LinkExit } from "react-native-plaid-link-sdk";
import {
  SimpleTransaction,
  createLinkToken,
  publicTokenExchange,
  transactionsSync,
} from "./lib";

import Passage from "@passageidentity/passage-react-native";

import { Authsignal } from "react-native-authsignal";

const authsignal = new Authsignal({
  tenantID: "a6788c94-3130-4c4b-ab10-6156374c45ea",
  baseURL: "https://api.authsignal.com/v1",
});

const passage = new Passage("bB8gXw5C8hvlXleJV4ev5rjt");

export default function App() {
  const [linkToken, setLinkToken] = useState<string>();
  const [transactions, setTransactions] = useState<Array<SimpleTransaction>>(
    []
  );

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
          style={tw`bg-orange-600 p-4 text-white font-bold uppercase overflow-hidden rounded-2xl w-50 text-center`}
        >
          Add Account
        </Text>
      </PlaidLink>
      <Pressable
        onPress={async () => {
          const data = await transactionsSync();
          setTransactions(data);
        }}
      >
        <Text
          style={tw`bg-yellow-600 text-white font-bold uppercase p-4 overflow-hidden rounded-2xl text-center w-50 mt-4`}
        >
          Get Transactions
        </Text>
      </Pressable>
      {transactions.length ? (
        <View>
          <Text
            style={tw`font-bold text-lg mt-4 text-gray-300 uppercase text-center`}
          >
            Total Spent:
          </Text>
          <Text style={tw`text-white font-extrabold text-4xl`}>
            $
            {Number(
              transactions
                .map((i) => i.amount)
                .reduce((total, amount) => total + amount)
                .toFixed(2)
            ) * -1}
          </Text>
        </View>
      ) : (
        ""
      )}
      {/* <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <Text style={tw`text-white`}>{item.name}</Text>
        )}
      /> */}
      <Button
        title="login"
        onPress={async () => {
          // try {
          // Register user
          // console.log("here?", await passage.getAppInfo());

          console.log("here 1");
          const { authToken } = await passage.registerWithPasskey(
            "winhenderson@gmail.com"
          );
          console.log("here 2");

          // Retrieve new user info
          const user = await passage.getCurrentUser();
          console.log(user);
          // } catch (error) {
          //   if (
          //     error instanceof PassageError &&
          //     error.code === PassageErrorCode.UserCancelled
          //   ) {
          //     // User cancelled native passkey prompt
          //   } else {
          //     // Optional: Passkey registration failed, try email or SMS registration instead.
          //   }
          // }
        }}
        // onPress={async () => {
        //   const res = await fetch(
        //     `${process.env.EXPO_PUBLIC_API_ENDPOINT}/auth-signal`
        //   );
        //   const json = await res.json();
        //   const { data: resultToken, error } = await authsignal.passkey.signUp({
        //     token: json.token,
        //     userName: "usr_123",
        //   });

        //   console.log({ resultToken, error });
        //   if (error) {
        //     console.log(error);
        //   } else if (resultToken) {
        //     console.log("the token!:", resultToken);
        //     // Pass this short-lived result token to your backend to validate that passkey registration succeeded
        //   }
        // }}
      />
    </SafeAreaView>
  );
}
