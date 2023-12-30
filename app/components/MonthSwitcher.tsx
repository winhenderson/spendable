import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React from "react";
import { View, Text, Pressable } from "react-native";
import tw from "twrnc";

type Props = {
  month: number;
  year: number;
  setMonth(newMonth: number): unknown;
  setYear(newYear: number): unknown;
};

const MonthSwitcher: React.FC<Props> = ({ month, year, setMonth, setYear }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthIsCurrent = month === currentMonth && year === currentYear;

  function forwardMonth() {
    if (monthIsCurrent) {
      return;
    }
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  }

  function backwardMonth() {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  }

  return (
    <View style={tw`flex flex-row items-center w-1/2 justify-around`}>
      <Pressable onPress={backwardMonth}>
        <ChevronLeft style={tw`text-teal-800 dark:text-teal-500`} />
      </Pressable>
      <View style={tw`flex flex-col items-center w-28`}>
        <Text
          style={tw`uppercase text-sm font-bold text-teal-900/65 dark:text-zinc-500`}
        >
          {year}
        </Text>
        <Text
          style={tw`uppercase text-lg font-bold text-teal-700 dark:text-teal-500`}
        >
          {getMonthName(month)}
        </Text>
      </View>
      <Pressable onPress={monthIsCurrent ? () => {} : forwardMonth}>
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