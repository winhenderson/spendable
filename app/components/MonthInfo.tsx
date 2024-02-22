import React, { useContext, useRef, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import tw from "twrnc";
import { isCurrentMonth } from "../lib";
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

  const inputRef = useRef<TextInput>(null);

  const [user] = useContext(UserContext);
  const [editingAmount, setEditingAmount] = useState<string | null>(null);
  const editing = editingAmount !== null;

  if (!user) {
    console.error("no user somehow");
    return <Loading />;
  }

  return (
    <View style={tw`pb-3 pt-2 w-2/3 flex flex-row justify-between`}>
      <Pressable
        style={tw`w-1/2 flex items-center`}
        onPress={() => inputRef.current?.focus()}
        onBlur={() => inputRef.current?.blur()}
      >
        <View style={tw`flex flex-row`}>
          {!editing && (
            <TextInput
              editable={false}
              style={tw`text-teal-950/80 text-2xl font-bold dark:text-zinc-300`}
              value={`$`}
            />
          )}

          <TextInput
            ref={inputRef}
            enterKeyHint="enter"
            enablesReturnKeyAutomatically={true}
            value={editingAmount ?? spendable.toString()}
            onFocus={() => {
              setEditingAmount(spendable.toString());
            }}
            onBlur={() => {
              updateMonthlySpendable(Number(editingAmount));
              setEditingAmount(null);
            }}
            style={tw`text-teal-950/80 text-2xl font-bold py-0 pr-1 dark:text-zinc-300`}
            onChangeText={setEditingAmount}
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
          style={tw`uppercase font-semibold text-xs text-zinc-500 dark:text-zinc-500`}
        >
          Spendable
        </Text>
        <Text
          style={tw`uppercase font-semibold text-xs text-zinc-500 dark:text-zinc-500`}
        >
          For {monthString}
        </Text>
      </Pressable>

      <View style={tw`w-1/2 flex items-center`}>
        <View style={tw`flex-1 flex justify-center items-center`}>
          <TextInput
            textAlign="center"
            style={tw`text-teal-950/80 text-2xl font-bold py-0 dark:text-zinc-300 text-center border-2 border-white android:p-0 bg-blue-700`}
            editable={false}
            value={`$${
              monthIsCurrent
                ? Math.round(
                    spendableToday(
                      Number(editingAmount ? editingAmount : spendable),
                      spent
                    )
                  )
                : Math.round(spent)
            }
          `}
          />
        </View>

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
