import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React from "react";
import { View, Text, Pressable } from "react-native";
import tw from "twrnc";

type Props = {
  month: number;
  year: number;
  forwardMonth(): unknown;
  backwardMonth(): unknown;
  monthIsCurrent: boolean;
  monthIsLast: boolean;
};

const MonthSwitcher: React.FC<Props> = ({
  month,
  year,
  forwardMonth,
  backwardMonth,
  monthIsCurrent,
  monthIsLast,
}) => {
  return (
    <View style={tw`flex flex-row items-center w-1/2 justify-around`}>
      <Pressable onPress={backwardMonth} hitSlop={15}>
        <ChevronLeft
          style={tw`${
            monthIsLast
              ? "text-zinc-200 dark:-text-zinc-700"
              : "text-teal-800 dark:text-teal-500"
          }`}
        />
      </Pressable>
      <View style={tw`flex flex-col items-center w-28`}>
        <Text
          style={tw`uppercase text-sm font-bold text-teal-900/65 dark:text-zinc-500`}
        >
          {year}
        </Text>
        <Text
          style={tw`uppercase text-lg font-bold text-teal-700 dark:text-teal-500 -mt-1`}
        >
          {getMonthName(month)}
        </Text>
      </View>
      <Pressable onPress={forwardMonth} hitSlop={15}>
        <ChevronRight
          style={tw`${
            monthIsCurrent
              ? "text-zinc-200 dark:text-zinc-700"
              : "text-teal-800 dark:text-teal-500"
          }`}
        />
      </Pressable>
    </View>
  );
};

export default MonthSwitcher;

function getMonthName(monthNumber: number): string {
  const date = new Date();
  date.setDate(1);
  date.setMonth(monthNumber);

  return date.toLocaleString("en-US", { month: "long" });
}
