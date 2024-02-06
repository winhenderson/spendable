import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import tw from "twrnc";
import { getMonthAmount, isCurrentMonth, updateMonthAmount } from "../lib";
import { spendableToday } from "../math";
import { Pencil } from "lucide-react-native";
import UserContext from "../UserContext";
import Loading from "./Loading";

type Props = {
  spent: number;
  month: number;
  year: number;
};

const MonthInfo: React.FC<Props> = ({ spent, month, year }) => {
  const monthString = new Date(2024, month).toLocaleString("en-US", {
    month: "long",
  });
  const monthIsCurrent = isCurrentMonth(new Date(year, month));

  const [editing, setEditing] = useState(false);
  const [user] = useContext(UserContext);
  const [amount, setAmount] = useState(user?.defaultSpendable.toString());

  useEffect(() => {
    getMonthAmount(user?.id ?? "", year, month).then((res) => {
      if (res.ok) {
        if (res.value) {
          setAmount(res.value.toString());
        } else {
          setAmount(user?.defaultSpendable.toString());
        }
      }
    });
  }, [month, user, year]);

  if (!user) {
    console.error("no user somehow");
    return <Loading />;
  }

  return (
    <View style={tw`pb-3 pt-2 w-2/3 flex flex-row justify-between`}>
      <View style={tw`w-1/2 flex items-center`}>
        <View style={tw`flex flex-row items-center`}>
          {!editing && (
            <Text style={tw`text-teal-950/80 text-2xl font-bold`}>$</Text>
          )}

          <TextInput
            enterKeyHint="enter"
            enablesReturnKeyAutomatically={true}
            value={amount}
            onFocus={() => setEditing(true)}
            onBlur={() => {
              console.log("blurred");
              setEditing(false);
              updateMonthAmount(Number(amount), user.id, month, year);
            }}
            style={tw`text-teal-950/80 text-2xl font-bold pt-0 pb-0`}
            onChangeText={setAmount}
            keyboardType="numeric"
            inputMode="numeric"
          />

          {!editing && (
            <View style={tw`flex justify-center`}>
              <Pencil size={15} style={tw`text-teal-900/65 text-xs`} />
            </View>
          )}
        </View>

        <Text
          style={tw`uppercase font-semibold text-xs text-zinc-500 dark:text-zinc-600 -mt-1`}
        >
          Spendable
        </Text>
        <Text
          style={tw`uppercase font-semibold text-xs text-zinc-500 dark:text-zinc-600`}
        >
          For {monthString}
        </Text>
      </View>

      <View style={tw`w-1/2 flex items-center`}>
        <Text
          style={tw`text-2xl font-bold text-teal-950/80 dark:text-zinc-400`}
        >
          $
          {monthIsCurrent
            ? Math.round(spendableToday(Number(amount), spent))
            : Math.round(spent)}
        </Text>
        <Text
          style={tw`uppercase font-semibold text-xs text-zinc-500 dark:text-zinc-600`}
        >
          {monthIsCurrent ? "Maximum" : "Spent In"}
        </Text>
        <Text
          style={tw`uppercase font-semibold text-xs text-zinc-500 dark:text-zinc-600`}
        >
          {monthIsCurrent ? "For Today" : `${monthString} ${year}`}
        </Text>
      </View>
    </View>
  );
};

export default MonthInfo;
