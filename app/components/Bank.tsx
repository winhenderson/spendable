import React, { useContext } from "react";
import { View, Image, Text, Pressable } from "react-native";
import tw from "twrnc";
import LetterIcon from "./LetterIcon";
import PlaidLink, { LinkExit, LinkSuccess } from "react-native-plaid-link-sdk";
import { deleteBankAccount, getAllTransactions, getUserById } from "../lib";
import UserContext from "../UserContext";
import { ArrowUpRight, Trash2 } from "lucide-react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import ColorSchemeContext from "../ColorSchemeContext";

type Props = {
  name: string;
  id: string;
  primaryColor?: string;
  logo?: string;
  loggedOutToken?: string;
};

const Bank: React.FC<Props> = ({
  logo,
  id,
  primaryColor,
  name,
  loggedOutToken,
}) => {
  const [user, setUser] = useContext(UserContext);
  const { showActionSheetWithOptions } = useActionSheet();
  const [, colorScheme] = useContext(ColorSchemeContext);

  if (!user) {
    throw new Error("no user authenticated");
  }

  return (
    <View style={tw`flex flex-row items-center justify-between`} key={id}>
      <View style={tw`flex flex-row gap-2 items-center`}>
        {logo ? (
          <Image source={{ uri: logo }} />
        ) : (
          <LetterIcon colorOverride={primaryColor ?? undefined} title={name} />
        )}
        <Text style={tw`text-teal-950 dark:text-teal-200 font-semibold`}>
          {name}
        </Text>
      </View>

      <View style={tw`flex flex-row gap-6 items-center`}>
        {loggedOutToken && (
          <PlaidLink
            tokenConfig={{
              token: loggedOutToken,
              noLoadingState: false,
            }}
            onSuccess={async (success: LinkSuccess) => {
              const res = await getAllTransactions(user.id);

              if (!res.ok) {
                console.error("failed to get new transactions");
                return;
              }

              setUser({
                ...user,
                transactions: [...res.value.transactions],
                loggedOutBanks: res.value.loggedOutBanks,
              });
            }}
            onExit={(exit: LinkExit) => console.log(exit)}
          >
            <View
              style={tw`flex flex-row bg-amber-600 py-1 px-3 rounded-full overflow-hidden items-center`}
            >
              <Text
                style={tw`text-white font-bold uppercase text-center text-xs`}
              >
                Re-Login
              </Text>
              <ArrowUpRight size={20} style={tw`text-orange-50`} />
            </View>
          </PlaidLink>
        )}
        <Pressable
          onPress={() => {
            showActionSheetWithOptions(
              {
                options: ["Unlink Bank Account", "Cancel"],
                cancelButtonIndex: 1,
                destructiveButtonIndex: 0,
                userInterfaceStyle: colorScheme,
                containerStyle: tw`dark:bg-zinc-800`,
                showSeparators: true,
                separatorStyle: tw`dark:bg-zinc-600`,
                textStyle: tw`dark:text-zinc-300`,
              },
              async (selectedIndex) => {
                if (selectedIndex === 1) {
                  return;
                } else {
                  deleteBankAccount(user.id, id);

                  const userRes = await getUserById(user.id);
                  if (!userRes.ok) {
                    console.error(
                      "failed to get a user after adding deleting a bank account"
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
                }
              }
            );
          }}
          hitSlop={16}
        >
          <Trash2 size={22} style={tw`text-red-500`} />
        </Pressable>
      </View>
    </View>
  );
};

export default Bank;
