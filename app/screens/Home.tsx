import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, Text, View, Pressable } from "react-native";
import PlaidLink, { LinkExit, LinkSuccess } from "react-native-plaid-link-sdk";
import tw from "twrnc";
import {
  SimpleTransaction,
  createLinkToken,
  publicTokenExchange,
  supabase,
  transactionsSync,
} from "../lib";
import { Session } from "@supabase/supabase-js";

type Props = {
  session: Session;
};

const Home: React.FC<Props> = ({ session }) => {
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
          publicTokenExchange(success.publicToken, session.user.id);
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
          const data = await transactionsSync(session.user.id);
          setTransactions(data);
          supabase.auth.signOut();
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

      <Pressable
        onPress={() => {
          supabase.auth.signOut();
        }}
      >
        <Text
          style={tw`bg-red-600 text-white font-bold uppercase p-4 overflow-hidden rounded-2xl text-center w-50 mt-4`}
        >
          Sign Out
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Home;
