import React, { useContext, useEffect, useState } from "react";
import { FlatList, Text, View, Image, Alert } from "react-native";
import PlaidLink, { LinkExit, LinkSuccess } from "react-native-plaid-link-sdk";
import tw from "twrnc";
import {
  createLinkToken,
  publicTokenExchange,
  getAllTransactions,
  getUserById,
} from "../lib";
import Loading from "../components/Loading";
import UserContext from "../UserContext";
import LetterIcon from "../components/LetterIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Banks: React.FC = () => {
  const [user, setUser] = useContext(UserContext);
  const [linkToken, setLinkToken] = useState<string>();
  const insets = useSafeAreaInsets();

  if (!user) {
    throw new Error("Not Registered");
  }

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
    <View
      style={tw`bg-white dark:bg-zinc-900 grow pt-[${insets.top}] pb-[${insets.bottom}]`}
    >
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
                const userRes = await getUserById(user.id);
                if (!userRes.ok) {
                  console.error("failed to get a user after adding an account");
                  return;
                }

                setUser(userRes.value);
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
        data={user.banks}
        contentContainerStyle={tw`gap-2 px-4`}
        renderItem={(bank) => (
          <View style={tw`flex flex-row gap-2 items-center`} key={bank.item.id}>
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
    </View>
  );
};

export default Banks;
