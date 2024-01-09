import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { calculateHeight, roundToHundredth } from "../math";

type Props = {
  spent: number;
  spendable: number;
};

const TOTAL_HEIGHT = 50;

const Balance: React.FC<Props> = ({ spent, spendable }) => {
  const height = calculateHeight(TOTAL_HEIGHT, spendable, spent);
  return (
    <View style={tw`flex items-center justify-center`}>
      <View style={tw`absolute z-10 items-center `}>
        <Text style={tw`font-bold text-3xl text-white`}>
          ${roundToHundredth(spendable - spent)}{" "}
        </Text>

        <Text style={tw`text-white/80 uppercase font-semibold text-sm`}>
          Remaining
        </Text>
      </View>

      <View
        style={tw`w-50 h-50 bg-teal-700/50 rounded-lg shadow-lg flex flex-col justify-end shadow-teal-950 dark:bg-teal-900/70 overflow-hidden`}
      >
        <View
          style={tw`h-[${height}] bg-teal-800 rounded-b-lg dark:bg-teal-500`}
        ></View>
      </View>
    </View>
  );
};

export default Balance;
