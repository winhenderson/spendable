import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import tw from "twrnc";
import { isCurrentMonth, updateMonthAmount } from "../lib";
import { spendableToday } from "../math";
import { Pencil } from "lucide-react-native";
import UserContext from "../UserContext";
import Loading from "./Loading";

type Props = {
  spendable: number;
  spent: number;
  month: number;
  year: number;
  updateMonthlySpendable(newAmount: number): unknown;
};

const MonthInfo: React.FC<Props> = ({
  spendable,
  spent,
  month,
  year,
  updateMonthlySpendable,
}) => {
  const monthString = new Date(2024, month).toLocaleString("en-US", {
    month: "long",
  });
  const monthIsCurrent = isCurrentMonth(new Date(year, month));

  const [user] = useContext(UserContext);
  const [editableAmount, setEditableAmount] = useState<string | null>(null);
  const editing = editableAmount !== null;

  if (!user) {
    console.error("no user somehow");
    return <Loading />;
  }

  return (
    <View style={tw`pb-3 pt-2 w-2/3 flex flex-row justify-between`}>
      <View style={tw`w-1/2 flex items-center`}>
        <View style={tw`flex flex-row items-center`}>
          {!editing && (
            <Text
              style={tw`text-teal-950/80 text-2xl font-bold dark:text-zinc-300`}
            >
              $
            </Text>
          )}

          <TextInput
            enterKeyHint="enter"
            enablesReturnKeyAutomatically={true}
            value={editableAmount ?? spendable.toString()}
            onFocus={() => {
              setEditableAmount(spendable.toString());
            }}
            onBlur={() => {
              updateMonthlySpendable(Number(editableAmount));
              setEditableAmount(null);
            }}
            style={tw`text-teal-950/80 text-2xl font-bold py-0 pr-1 dark:text-zinc-300`}
            onChangeText={setEditableAmount}
            keyboardType="numeric"
            inputMode="numeric"
          />

          {!editing && (
            <View style={tw`flex justify-center`}>
              <Pencil
                size={15}
                style={tw`text-teal-900/65 text-xs dark:text-teal-600/50`}
              />
            </View>
          )}
        </View>

        <Text
          style={tw`uppercase font-semibold text-xs text-zinc-500 dark:text-zinc-500 -mt-1`}
        >
          Spendable
        </Text>
        <Text
          style={tw`uppercase font-semibold text-xs text-zinc-500 dark:text-zinc-500`}
        >
          For {monthString}
        </Text>
      </View>

      <View style={tw`w-1/2 flex items-center`}>
        <Text
          style={tw`text-2xl font-bold text-teal-950/80 dark:text-zinc-300`}
        >
          $
          {monthIsCurrent
            ? Math.round(spendableToday(Number(editableAmount), spent))
            : Math.round(spent)}
        </Text>
        <Text
          style={tw`uppercase font-semibold text-xs text-zinc-500 dark:text-zinc-500`}
        >
          {monthIsCurrent ? "Maximum" : "Spent In"}
        </Text>
        <Text
          style={tw`uppercase font-semibold text-xs text-zinc-500 dark:text-zinc-500`}
        >
          {monthIsCurrent ? "For Today" : `${monthString} ${year}`}
        </Text>
      </View>
    </View>
  );
};

export default MonthInfo;
