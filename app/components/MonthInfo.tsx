import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { isCurrentMonth } from "../lib";
import { spendableToday } from "../math";

type Props = {
  spendable: number;
  spent: number;
  month: number;
  year: number;
};

const MonthInfo: React.FC<Props> = ({ spendable, spent, month, year }) => {
  const monthString = new Date(2024, month).toLocaleString("en-US", {
    month: "long",
  });
  const monthIsCurrent = isCurrentMonth(new Date(year, month));

  return (
    <View style={tw`pb-3 pt-2 w-2/3 flex flex-row justify-between`}>
      <View style={tw`w-1/2 flex items-center`}>
        <Text style={tw`text-2xl font-bold text-teal-950`}>${spendable}</Text>
        <Text style={tw`uppercase font-semibold text-xs text-zinc-500`}>
          Spendable
        </Text>
        <Text style={tw`uppercase font-semibold text-xs text-zinc-500`}>
          For {monthString}
        </Text>
      </View>

      <View style={tw`w-1/2 flex items-center`}>
        <Text style={tw`text-2xl font-bold text-teal-950`}>
          ${monthIsCurrent ? spendableToday(spendable, spent) : spent}
        </Text>
        <Text style={tw`uppercase font-semibold text-xs text-zinc-500`}>
          {monthIsCurrent ? "Maximum" : "Spent In"}
        </Text>
        <Text style={tw`uppercase font-semibold text-xs text-zinc-500`}>
          {monthIsCurrent ? "For Today" : `${monthString} ${year}`}
        </Text>
      </View>
    </View>
  );
};

export default MonthInfo;
