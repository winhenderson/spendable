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
      ListHeaderComponent={
        <View style={tw`flex flex-row w-full`}>
          <Text>Merchant</Text>
          <Text>Date</Text>
          <Text>Amount</Text>
        </View>
      }
      style={tw`flex w-full px-4 `}
      contentContainerStyle={tw`gap-1`}
      data={sorted}
      renderItem={(transaction) => (
        <Transaction transaction={transaction.item} />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

export default TransactionsList;
