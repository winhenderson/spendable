import React, { useContext, useEffect, useState } from "react";
import { FlatList, Text, View, Image, Alert } from "react-native";
import PlaidLink, { LinkExit, LinkSuccess } from "react-native-plaid-link-sdk";
import tw from "twrnc";
import {
  BankTitle,
  accountsGet,
  createLinkToken,
  publicTokenExchange,
  getAllTransactions,
} from "../lib";
import Loading from "../components/Loading";
import UserContext from "../UserContext";
import LetterIcon from "../components/LetterIcon";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={tw`bg-white dark:bg-zinc-900 grow`}>
      <FlatList
        ListHeaderComponent={
          <View style={tw`flex items-center gap-4 mb-4`}>
            <View style={tw`flex flex-row justify-center items-center`}>
              <Text style={tw`text-3xl text-teal-900 font-bold`}>
                Connected Banks
              </Text>
            </View>

            <PlaidLink
              tokenConfig={{
                token: linkToken,
                noLoadingState: false,
              }}
              onSuccess={async (success: LinkSuccess) => {
                await publicTokenExchange(success.publicToken, user.id);
                const res = await getAllTransactions(user.id);

                if (!res.ok) {
                  Alert.alert(
                    "Database error",
                    `failed to fetch transactions for new bank.\nError: ${res.error}`
                  );
                  return;
                }

                setUser({
                  ...user,
                  transactions: [...user.transactions, ...res.value],
                });
              }}
              onExit={(exit: LinkExit) => console.log(exit)}
            >
              <Text
                style={tw`bg-orange-600 p-4 text-white font-bold uppercase overflow-hidden rounded-2xl w-50 text-center`}
              >
                Add Account
              </Text>
            </PlaidLink>
          </View>
        }
        data={banks}
        contentContainerStyle={tw`gap-2 px-4`}
        renderItem={(bank) => (
          <View style={tw`flex flex-row gap-2 items-center`}>
            {bank.item.logo ? (
              <Image source={{ uri: bank.item.logo }} />
            ) : (
              <LetterIcon
                colorOverride={bank.item.primary_color ?? undefined}
                title={bank.item.name}
              />
            )}
            <Text style={tw`text-teal-950 dark:text-teal-200 font-semibold`}>
              {bank.item.name}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Banks;
