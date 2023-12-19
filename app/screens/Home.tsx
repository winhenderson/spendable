import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, Text, View, Pressable } from "react-native";
import PlaidLink, { LinkExit, LinkSuccess } from "react-native-plaid-link-sdk";
import tw from "twrnc";
import {
  SimpleTransaction,
  createLinkToken,
  publicTokenExchange,
  transactionsSync,
} from "../lib";

export default function Home() {
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
    </SafeAreaView>
  );
}
