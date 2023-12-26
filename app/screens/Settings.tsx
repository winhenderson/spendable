import React, { useState } from "react";
import { SafeAreaView, Text } from "react-native";
import Button from "../components/Button";
import tw from "twrnc";
import PlaidLink, { LinkExit, LinkSuccess } from "react-native-plaid-link-sdk";
import {
  publicTokenExchange,
  SimpleTransaction,
  supabase,
  transactionsSync,
  updateAmount,
  User,
} from "../lib";
import Input from "../components/Input";

type Props = {
  user: User;
  linkToken: string;
  // setTransactions(transactions: Array<SimpleTransaction>): void;
};

const Settings: React.FC<Props> = ({ user, linkToken }) => {
  const [amount, setAmount] = useState(user?.amount ? String(user.amount) : "");

  return (
    <SafeAreaView
      style={tw`bg-teal-800 items-center justify-center flex grow p-1 gap-2`}
    >
      <Input
        type="number"
        placeholder="2000"
        onChange={setAmount}
        value={amount}
      >
        Spendable Amount
      </Input>
      <Button
        onPress={() => {
          updateAmount(Number(amount), user.id);
          // setUser({ ...user, amount: Number(amount) });
        }}
        color="purple-800"
        style="text-sm"
      >
        Update Amount
      </Button>

      <PlaidLink
        tokenConfig={{
          token: linkToken,
          noLoadingState: false,
        }}
        onSuccess={async (success: LinkSuccess) => {
          publicTokenExchange(success.publicToken, user.id);
          // TODO: Somehow load new transactions after a account is added
          // const data = await transactionsSync(user.id);
          // setTransactions(data);
        }}
        onExit={(exit: LinkExit) => console.log(exit)}
      >
        <Text
          style={tw`bg-orange-600 p-4 text-white font-bold uppercase overflow-hidden rounded-2xl w-50 text-center`}
        >
          Add Account
        </Text>
      </PlaidLink>

      {/* <Button
        onPress={async () => {
          const data = await transactionsSync(user.id);
          setTransactions(data);
        }}
        color="indigo-900"
        style="text-sm"
      >
        Get Transactions
      </Button> */}

      {/* {transactions.length ? (
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
      )} */}

      <Button
        onPress={() => {
          supabase.auth.signOut();
        }}
        color="red-700"
        style="text-sm"
      >
        Sign Out
      </Button>
    </SafeAreaView>
  );
};

export default Settings;
