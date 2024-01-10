import React, { useContext, useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, View, Image } from "react-native";
import PlaidLink, { LinkExit, LinkSuccess } from "react-native-plaid-link-sdk";
import tw from "twrnc";
import {
  BankTitle,
  accountsGet,
  createLinkToken,
  publicTokenExchange,
  getMonthTransactions,
  getAllTransactions,
} from "../lib";
import Loading from "../components/Loading";
import UserContext from "../UserContext";

const Banks: React.FC = () => {
  const [user, setUser] = useContext(UserContext);
  const [linkToken, setLinkToken] = useState<string>();
  const [banks, setBanks] = useState<BankTitle[]>([]);

  if (!user) {
    throw new Error("Not Registered");
  }

  async function createNewLinkToken() {
    const token = await createLinkToken();
    setLinkToken(token);
  }

  useEffect(() => {
    accountsGet(user.id).then((res) => {
      if (res.ok) {
        setBanks(res.value);
      }
    });
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
      style={tw`bg-white dark:bg-zinc-900 items-center justify-center flex grow p-1 gap-2`}
    >
      <FlatList
        data={banks}
        renderItem={(bank) => (
          <View>
            {bank.item.logo && <Image source={{ uri: bank.item.logo }} />}
            <Text style={tw`text-teal-950 dark:text-teal-200`}>
              {bank.item.name}
            </Text>
          </View>
        )}
      />

      <PlaidLink
        tokenConfig={{
          token: linkToken,
          noLoadingState: false,
        }}
        onSuccess={async (success: LinkSuccess) => {
          await publicTokenExchange(success.publicToken, user.id);
          const res = await getAllTransactions(user.id);
          if (res.ok) {
            setUser({ ...user, transactions: res.value });
          }
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
