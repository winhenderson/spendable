import React from "react";
import { SimpleTransaction } from "../lib";
import { Text, View } from "react-native";
import tw from "twrnc";

type Props = { transaction: SimpleTransaction };

const Transaction: React.FC<Props> = ({ transaction }) => {
  return (
    <View style={tw`flex flex-row items-center`}>
      <Text style={tw`w-1/5 dark:text-teal-50`}>{transaction.amount}</Text>
      <Text style={tw`w-3/5 dark:text-teal-50`}>{transaction.name}</Text>
      <Text style={tw` dark:text-teal-50`}>{transaction.date}</Text>
    </View>
  );
};

export default Transaction;