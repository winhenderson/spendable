import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

type Props = {
  spent: number;
  spendable: number;
};

const Balance: React.FC<Props> = ({ spent, spendable }) => {
  return (
    <View style={tw`flex items-center justify-center`}>
      <View style={tw`absolute z-10 items-center `}>
        <Text style={tw`font-bold text-3xl text-white`}>
          ${(spendable - spent).toFixed(0)}{" "}
        </Text>

        <Text style={tw`text-white/80 uppercase font-semibold text-sm`}>
          Remaining
        </Text>
      </View>

      <View
        style={tw`w-50 h-50 bg-teal-700/50 rounded-lg shadow-lg flex flex-col justify-end shadow-teal-950 dark:bg-green-300`}
      >
        <View
          style={tw`h-[${
            50 - (1 / (spendable / spent)) * 50
          }] bg-teal-800 rounded-b-lg`}
        ></View>
      </View>
    </View>
  );
};

export default Balance;
