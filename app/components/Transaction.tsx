import React, { useContext, useState } from "react";
import { SimpleTransaction, getAllTransactions, ignore } from "../lib";
import { Text, View, Image, Alert, Pressable } from "react-native";
import tw from "twrnc";
import UserContext from "../UserContext";
import { Eye, EyeOff } from "lucide-react-native";
import LetterIcon from "./LetterIcon";
import Loading from "./Loading";

type Props = { transaction: SimpleTransaction };

const Transaction: React.FC<Props> = ({ transaction }) => {
  const [user, setUser] = useContext(UserContext);
  const [syncing, setSyncing] = useState(false);

  if (!user) {
    throw new Error("No logged in user");
  }

  function toggleIgnored() {
    if (!user) {
      throw new Error("No logged in user");
    }

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
  }

  const struckThrough = transaction.ignore
    ? "line-through italic text-zinc-500 dark:text-zinc-600"
    : "";

  return (
    <View
      style={tw`w-full flex flex-row py-2 px-6 items-center rounded-2xl ${
        transaction.ignore ? "bg-zinc-100 dark:bg-zinc-800" : ""
      }`}
    >
      <View style={tw`w-7`}>
        {transaction.logo_url ? (
          <Image
            blurRadius={transaction.ignore ? 3 : undefined}
            source={{ uri: transaction.logo_url }}
            style={tw`w-7 h-7 rounded-lg`}
          />
        ) : (
          <LetterIcon title={transaction.name} blurred={transaction.ignore} />
        )}
      </View>
      <Text style={tw`dark:text-zinc-50 w-1/2 p-2 ${struckThrough}`}>
        {transaction.name}
      </Text>
      <Text style={tw`dark:text-zinc-50 w-18 ${struckThrough}`}>
        {createDate(transaction.date)}
      </Text>
      <Text
        style={tw`w-20 font-semibold ${
          transaction.amount > 0
            ? transaction.ignore
              ? "text-green-900/50 dark:text-green-900/70"
              : "text-green-600 dark:text-green-500"
            : transaction.ignore
            ? "text-red-950/50 dark:text-red-900/70"
            : "text-red-600"
        } ${transaction.ignore ? "line-through italic" : ""}`}
      >
        {transaction.amount > 0
          ? `+${transaction.amount.toFixed(2)}`
          : transaction.amount.toFixed(2)}
      </Text>

      <Pressable
        hitSlop={{ top: 20, left: 17, right: 12, bottom: 16 }}
        style={tw`w-5`}
        disabled={syncing}
        onPress={async () => {
          setSyncing(true);
          toggleIgnored();
          const success = await ignore(transaction.id, user.id);
          if (!success) {
            toggleIgnored();
            Alert.alert("Update Failed");
          }

          const transactions = await getAllTransactions(user.id);
          if (!transactions.ok) {
            Alert.alert("Transaction Sync Failed");
            return;
          }

          setUser({ ...user, transactions: transactions.value });
          setSyncing(false);
        }}
      >
        {transaction.ignore ? (
          <EyeOff style={tw`text-zinc-600`} size={18} />
        ) : (
          <Eye style={tw`text-zinc-600`} size={18} />
        )}
      </Pressable>
    </View>
  );
};

function createDate(dateString: string) {
  const date = new Date(dateString);

  return `${date.toLocaleDateString("en-US", {
    month: "short",
  })} ${date.getDate()}`;
}

export default Transaction;
