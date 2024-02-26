import React, { useCallback, useContext, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import PlaidLink, { LinkExit, LinkSuccess } from "react-native-plaid-link-sdk";
import tw from "twrnc";
import {
  createLinkToken,
  publicTokenExchange,
  getUserById,
  getAllTransactions,
} from "../lib";
import Loading from "../components/Loading";
import UserContext from "../UserContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Bank from "../components/Bank";

const Banks: React.FC = () => {
  const [user, setUser] = useContext(UserContext);
  const [linkToken, setLinkToken] = useState<string>();
  const [loggedOutBankTokens, setLoggedOutBankTokens] = useState<
    Record<string, string>
  >({});
  const insets = useSafeAreaInsets();

  if (!user) {
    throw new Error("Not Registered");
  }

  async function createNewLinkToken() {
    const token = await createLinkToken();
    setLinkToken(token);
  }

  const createLoggedOutBankToken = useCallback(
    async (id: string) => {
      const token = await createLinkToken(id);
      setLoggedOutBankTokens({ ...loggedOutBankTokens, [id]: token });
    },
    [loggedOutBankTokens]
  );

  useEffect(() => {
    if (linkToken === undefined) {
      createNewLinkToken();
    }
  }, [linkToken]);

  useEffect(() => {
    for (const bank of user.loggedOutBanks) {
      if (loggedOutBankTokens[bank] === undefined) {
        createLoggedOutBankToken(bank);
      }
    }
  }, [loggedOutBankTokens, user.loggedOutBanks, createLoggedOutBankToken]);

  if (!linkToken) {
    return <Loading />;
  }

  return (
    <View
      style={tw`bg-white dark:bg-zinc-900 px-6 grow pt-[${insets.top + 8}]`}
    >
      <View style={tw`grow`}>
        <FlatList
          ListEmptyComponent={
            <View style={tw`flex items-center gap-2`}>
              <Text
                style={tw`text-lg text-zinc-800 dark:text-zinc-100 font-bold`}
              >
                No banks connected yet.
              </Text>

              <PlaidLink
                tokenConfig={{
                  token: linkToken,
                  noLoadingState: false,
                }}
                onSuccess={async (success: LinkSuccess) => {
                  await publicTokenExchange(success.publicToken, user.id);
                  const userRes = await getUserById(user.id);
                  if (!userRes.ok) {
                    console.error(
                      "failed to get a user after adding an account"
                    );
                    return;
                  }

                  const transactionsRes = await getAllTransactions(user.id);
                  if (!transactionsRes.ok) {
                    console.error("failed to get user transactions");
                    return;
                  }

                  setUser({
                    ...userRes.value,
                    transactions: transactionsRes.value.transactions,
                    loggedOutBanks: transactionsRes.value.loggedOutBanks,
                  });
                }}
                onExit={(exit: LinkExit) => console.log(exit)}
              >
                <Text
                  style={tw`bg-teal-700 p-4 text-white font-bold uppercase overflow-hidden rounded-2xl text-center w-50`}
                >
                  Connect One!
                </Text>
              </PlaidLink>
            </View>
          }
          ListHeaderComponent={
            <View style={tw`flex items-center gap-4 mb-4`}>
              <View style={tw`flex flex-row justify-center items-center`}>
                <Text
                  style={tw`text-3xl text-teal-900 dark:text-teal-600 font-bold`}
                >
                  Connected Banks
                </Text>
              </View>
            </View>
          }
          data={user.banks}
          contentContainerStyle={tw`gap-4`}
          renderItem={({ item: bank }) => (
            <Bank
              logo={bank.logo ?? undefined}
              primaryColor={bank.primary_color ?? undefined}
              id={bank.id}
              name={bank.name}
              loggedOutToken={
                user.loggedOutBanks.includes(bank.id)
                  ? loggedOutBankTokens[bank.id]
                  : undefined
              }
            />
          )}
        />
      </View>

      {user.banks.length > 0 && (
        <View style={tw`flex items-center justify-center pb-4`}>
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

              const transactionsRes = await getAllTransactions(user.id);
              if (!transactionsRes.ok) {
                console.error("failed to get user transactions");
                return;
              }

              setUser({
                ...userRes.value,
                transactions: transactionsRes.value.transactions,
                loggedOutBanks: transactionsRes.value.loggedOutBanks,
              });
            }}
            onExit={(exit: LinkExit) => console.log(exit)}
          >
            <Text
              style={tw`bg-teal-700 p-4 text-white font-bold uppercase overflow-hidden rounded-2xl w-50 text-center`}
            >
              Add Account
            </Text>
          </PlaidLink>
        </View>
      )}
    </View>
  );
};

export default Banks;
