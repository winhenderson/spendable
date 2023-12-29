import React, { useContext, useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text } from "react-native";
import PlaidLink, { LinkExit, LinkSuccess } from "react-native-plaid-link-sdk";
import tw from "twrnc";
import {
  BankTitle,
  accountsGet,
  createLinkToken,
  publicTokenExchange,
  transactionsSync,
} from "../lib";
import Loading from "../components/Loading";
import UserContext from "../UserContext";

const Banks: React.FC = () => {
  const [user, setUser] = useContext(UserContext);
  const [linkToken, setLinkToken] = useState<string>();
  const [banks, setBanks] = useState<BankTitle[]>([]);

  async function createNewLinkToken() {
    const token = await createLinkToken();
    setLinkToken(token);
  }

  async function getBanks() {
    setBanks(await accountsGet(user.id));
  }
  useEffect(() => {
    getBanks();
  }, [user, linkToken]);

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
      style={tw`bg-white dark:bg-slate-900 items-center justify-center flex grow p-1 gap-2`}
    >
      <FlatList
        data={banks}
        renderItem={(bank) => (
          <Text style={tw`text-teal-950`}>{bank.item.name}</Text>
        )}
      />

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
    </SafeAreaView>
  );
};

export default Banks;
