import React from "react";
import { SimpleTransaction } from "../lib";
import { Text, View, Image } from "react-native";
import tw from "twrnc";

type Props = { transaction: SimpleTransaction };

const Transaction: React.FC<Props> = ({ transaction }) => {
  return (
    <View style={tw`flex flex-row py-2 items-center w-85 rounded-lg`}>
      <View style={tw`w-7`}>
        {transaction.logo_url && (
          <Image
            source={{ uri: transaction.logo_url }}
            style={tw`w-7 h-7 rounded-lg`}
          />
        )}
      </View>
      <Text style={tw`dark:text-teal-50 w-1/2 p-2`}>{transaction.name}</Text>
      <Text style={tw`dark:text-teal-50 w-18`}>
        {createDate(transaction.date)}
      </Text>
      <Text
        style={tw`dark:text-teal-50 w-20 font-semibold ${
          transaction.amount > 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {transaction.amount > 0
          ? `+${transaction.amount.toFixed(2)}`
          : transaction.amount.toFixed(2)}
      </Text>
    </View>
  );
};
// TODO: add the default icon thing like a colored circle with a letter?

function createDate(dateString: string) {
  const date = new Date(dateString);

  return `${date.toLocaleDateString("en-US", {
    month: "short",
  })}. ${date.getDate()}`;
}

export default Transaction;
