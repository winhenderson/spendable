import { ArrowUpRight } from "lucide-react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Text, Image, View } from "react-native";
import tw from "twrnc";
import { BankTitle, createLinkToken, getAllTransactions } from "../lib";
import LetterIcon from "./LetterIcon";
import PlaidLink, { LinkExit, LinkSuccess } from "react-native-plaid-link-sdk";
import UserContext from "../UserContext";

type Props = {
  bank: BankTitle | null;
};

const ReloginBanner: React.FC<Props> = ({ bank }) => {
  const [user, setUser] = useContext(UserContext);
  const [loggedOutBankTokens, setLoggedOutBankTokens] = useState<
    Record<string, string>
  >({});

  if (!user) {
    throw new Error("Not Registered");
  }

  const createLoggedOutBankToken = useCallback(
    async (id: string) => {
      const token = await createLinkToken(id);
      setLoggedOutBankTokens({ ...loggedOutBankTokens, [id]: token });
    },
    [loggedOutBankTokens]
  );

  useEffect(() => {
    for (const bank of user.loggedOutBanks) {
      if (loggedOutBankTokens[bank] === undefined) {
        createLoggedOutBankToken(bank);
      }
    }
  }, [loggedOutBankTokens, user.loggedOutBanks, createLoggedOutBankToken]);

  if (!bank) {
    throw new Error("Somehow got logged out bank without any information");
  }

  return (
    <PlaidLink
      tokenConfig={{
        token: loggedOutBankTokens[bank.id],
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
        style={tw`flex shrink-0 flex-row bg-amber-600 px-3 py-2 rounded-lg gap-2 items-center`}
      >
        {bank.logo ? (
          <Image source={{ uri: bank.logo }} />
        ) : (
          <LetterIcon
            colorOverride={bank.primary_color ?? undefined}
            title={bank.name}
            style={`w-6 h-6`}
          />
        )}
        <Text style={tw`font-bold uppercase text-sm text-orange-50`}>
          {bank.name}
        </Text>
        <Text style={tw`text-xs text-orange-50 font-semibold`}>
          Relogin Required
        </Text>
        <ArrowUpRight size={24} style={tw`text-amber-50`} />
      </View>
    </PlaidLink>
  );
};

export default ReloginBanner;
