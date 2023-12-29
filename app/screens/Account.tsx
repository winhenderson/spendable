import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView, Text } from "react-native";
import Button from "../components/Button";
import tw from "twrnc";
import PlaidLink, { LinkExit, LinkSuccess } from "react-native-plaid-link-sdk";
import {
  createLinkToken,
  publicTokenExchange,
  supabase,
  transactionsSync,
  updateAmount,
} from "../lib";
import Input from "../components/Input";
import UserContext from "../UserContext";
import Loading from "../components/Loading";

const Settings: React.FC = () => {
  const [user, setUser] = useContext(UserContext);

  const [amount, setAmount] = useState(String(user.amount));
  const [linkToken, setLinkToken] = useState<string>();

  async function createNewLinkToken() {
    const token = await createLinkToken();
    setLinkToken(token);
  }

  useEffect(() => {
    if (linkToken === undefined) {
      createNewLinkToken();
    }
  }, [linkToken]);

  if (!linkToken) {
    return <Loading />;
  }

  return (
    <SafeAreaView
      style={tw`bg-white items-center justify-center flex grow p-1 gap-2`}
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
          setUser({ ...user, amount: Number(amount) });
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
          await publicTokenExchange(success.publicToken, user.id);
          const data = await transactionsSync(user.id);
          setUser({ ...user, transactions: data });
        }}
        onExit={(exit: LinkExit) => console.log(exit)}
      >
        <Text
          style={tw`bg-orange-600 p-4 text-white font-bold uppercase overflow-hidden rounded-2xl w-50 text-center`}
        >
          Add Account
        </Text>
      </PlaidLink>

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
