import React from "react";
import { FlatList, Text, View } from "react-native";
import { SimpleTransaction } from "../lib";
import Transaction from "./Transaction";
import tw from "twrnc";

type Props = {
  transactions: Array<SimpleTransaction>;
};

const TransactionsList: React.FC<Props> = ({ transactions }) => {
  const sorted = transactions.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return Number(dateB) - Number(dateA);
  });

  return (
    <FlatList
      ItemSeparatorComponent={() => (
        <View style={tw`h-[1px] bg-zinc-100 dark:bg-zinc-800`} />
      )}
      ListHeaderComponent={
        <View
          style={tw`flex flex-row items-center w-85 justify-start py-2 border-b-[0.2px] border-b-zinc-500`}
        >
          <Text
            style={tw`uppercase font-bold text-xs text-teal-900 dark:text-teal-600 w-1/2 mr-7`}
          >
            Merchant
          </Text>
          <Text
            style={tw`uppercase font-bold text-xs w-18 text-teal-900 dark:text-teal-600`}
          >
            Date
          </Text>
          <Text
            style={tw`uppercase font-bold text-xs text-teal-900 dark:text-teal-600`}
          >
            Amount
          </Text>
        </View>
      }
      style={tw`flex w-full px-4`}
      contentContainerStyle={tw`gap-1 flex items-center pb-40]`}
      data={sorted}
      renderItem={(transaction) => (
        <Transaction transaction={transaction.item} />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

export default TransactionsList;
