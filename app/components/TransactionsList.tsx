import React from "react";
import { FlatList } from "react-native";
import { SimpleTransaction } from "../lib";
import Transaction from "./Transaction";
import tw from "twrnc";

type Props = {
  transactions: Array<SimpleTransaction>;
};

const TransactionsList: React.FC<Props> = ({ transactions }) => {
  return (
    <FlatList
      style={tw`flex w-full px-4`}
      data={transactions}
      renderItem={(transaction) => (
        <Transaction transaction={transaction.item} />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

export default TransactionsList;
