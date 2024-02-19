import { ArrowUpRight } from "lucide-react-native";
import React from "react";
import { Pressable, Text, Image } from "react-native";
import tw from "twrnc";
import { BankTitle } from "../lib";
import LetterIcon from "./LetterIcon";

type Props = {
  bank: BankTitle | null;
};

const ReloginBanner: React.FC<Props> = ({ bank }) => {
  if (!bank) {
    throw new Error("Somehow got logged out bank without any information");
  }
  return (
    <Pressable
      style={tw`flex shrink-0 flex-row bg-amber-600 px-3 py-2 rounded-lg gap-2 items-center`}
    >
      {bank.logo ? (
        <Image source={{ uri: bank.logo }} />
      ) : (
        <LetterIcon
          colorOverride={bank.primary_color ?? undefined}
          title={bank.name}
          style={`w-5 h-6`}
        />
      )}
      <Text style={tw`font-bold uppercase text-sm text-orange-50`}>
        {bank.name}
      </Text>
      <Text style={tw`text-xs text-orange-50 font-semibold`}>
        Relogin Required
      </Text>
      <ArrowUpRight size={24} style={tw`text-orange-50`} />
    </Pressable>
  );
};

export default ReloginBanner;
