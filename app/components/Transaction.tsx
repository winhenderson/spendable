import React, { useContext } from "react";
import { SimpleTransaction, ignore, transactionsSync } from "../lib";
import { Text, View, Image, Button, Alert } from "react-native";
import tw from "twrnc";
import UserContext from "../UserContext";

type Props = { transaction: SimpleTransaction };

const Transaction: React.FC<Props> = ({ transaction }) => {
  const [user, setUser] = useContext(UserContext);

  return (
    <View
      style={tw`flex flex-row py-2 items-center w-85 rounded-lg ${
        transaction.ignore ? "bg-red-500" : ""
      }`}
    >
      <View style={tw`w-7`}>
        {transaction.logo_url && (
          <Image
            source={{ uri: transaction.logo_url }}
            style={tw`w-7 h-7 rounded-lg`}
          />
        )}
      </View>
      <Text style={tw`dark:text-zinc-50 w-1/2 p-2`}>{transaction.name}</Text>
      <Text style={tw`dark:text-zinc-50 w-18`}>
        {createDate(transaction.date)}
      </Text>
      <Text
        style={tw`w-20 font-semibold ${
          transaction.amount > 0
            ? "text-green-600 dark:text-green-500"
            : "text-red-600"
        }`}
      >
        {transaction.amount > 0
          ? `+${transaction.amount.toFixed(2)}`
          : transaction.amount.toFixed(2)}
      </Text>
      <Button
        title={"ignore"}
        onPress={async () => {
          setUser({
            ...user,
            transactions: [
              ...user.transactions.map((t) => {
                if (t.id === transaction.id) {
                  t.ignore = !t.ignore;
                }
                return t;
              }),
            ],
          });
          const success = await ignore(transaction.id, user.id);
          if (!success) {
            Alert.alert("Update Failed");
          }
          const res = await transactionsSync(user.id);
          if (res.ok) {
            setUser({ ...user, transactions: res.value });
          }
        }}
      />
    </View>
  );
};
// TODO: add the default icon thing like a colored circle with a letter?

function createDate(dateString: string) {
  const date = new Date(dateString);

  return `${date.toLocaleDateString("en-US", {
    month: "short",
  })} ${date.getDate()}`;
}

export default Transaction;
