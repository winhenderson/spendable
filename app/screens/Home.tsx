import { useCallback, useContext, useEffect, useState } from "react";
import { FlatList, View, Text, Alert, RefreshControl } from "react-native";
import tw from "twrnc";
import Balance from "../components/Balance";
import UserContext from "../UserContext";
import MonthSwitcher from "../components/MonthSwitcher";
import Loading from "../components/Loading";
import { calculateSpent } from "../math";
import MonthInfo from "../components/MonthInfo";
import Transaction from "../components/Transaction";
import { getAllTransactions, getMonthAmount } from "../lib";
import { Plus } from "lucide-react-native";
import ColorSchemeContext from "../ColorSchemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Home: React.FC = () => {
  const [colorScheme] = useContext(ColorSchemeContext);
  const [user, setUser] = useContext(UserContext);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState(user?.defaultSpendable.toString());

  useEffect(() => {
    getMonthAmount(user?.id ?? "", year, month).then((res) => {
      if (res.ok) {
        if (res.value) {
          setAmount(res.value.toString());
          // } else {
          //   console.log("shoudl be in here", user?.defaultSpendable.toString());
          //   setAmount(user?.defaultSpendable.toString());
          //   // console.log(amount);
        }
      }
    });
  }, [month, user, year, setAmount]);

  const getTransactions = useCallback(async () => {
    if (!user) {
      throw new Error("No user to sync transactions for");
    }
    setRefreshing(true);

    getAllTransactions(user.id).then((transactions) => {
      if (!transactions.ok) {
        Alert.alert("Transaction Sync Failed");
        return;
      }
      setUser({ ...user, transactions: transactions.value });
      setRefreshing(false);
    });
  }, [user, setUser]);

  function addTransaction() {
    console.log("need to implement this!");
  }

  if (!user) {
    return <Loading />;
  }

  if (!user.transactions) {
    return <Loading />;
  }

  const monthTransactions = user.transactions.filter((transaction) => {
    return (
      Number(transaction.date.split("-")[1]) === month + 1 &&
      Number(transaction.date.split("-")[0]) === year
    );
  });

  const unignoredMonthTransactions = monthTransactions.filter(
    (transaction) => !transaction.ignore
  );

  let firstTransaction = { month: 0, year: new Date().getFullYear() };
  if (user.transactions.length) {
    const firstTransactionDate = user.transactions.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return Number(dateA) - Number(dateB);
    })[0].date;
    firstTransaction = {
      month: Number(firstTransactionDate.split("-")[1]) - 1,
      year: Number(firstTransactionDate.split("-")[0]),
    };
  }

  const spent = calculateSpent(
    user.defaultSpendable,
    unignoredMonthTransactions.map((i) => i.amount)
  );

  const sorted = monthTransactions.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return Number(dateB) - Number(dateA);
  });

  return (
    <View
      style={tw`bg-white dark:bg-zinc-900 items-center justify-center flex grow gap-2 min-h-screen pt-[${
        insets.top + 4
      }] pb-[${insets.bottom}]`}
    >
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={getTransactions}
            colors={colorScheme === "dark" ? ["white"] : ["gray"]}
            tintColor={colorScheme === "dark" ? "white" : "gray"}
          />
        }
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <>
            <MonthSwitcher
              year={year}
              setYear={setYear}
              month={month}
              setMonth={setMonth}
              firstTransaction={firstTransaction}
            />
            <Balance
              spent={spent}
              spendable={amount ? Number(amount) : user.defaultSpendable}
            />
            <MonthInfo
              spendable={amount ?? user.defaultSpendable.toString()}
              spent={spent}
              month={month}
              year={year}
            />

            <View style={tw`flex flex-row items-center w-full p-2`}>
              <Text
                style={tw`uppercase font-bold text-xs text-teal-900 dark:text-teal-600 grow`}
              >
                Merchant
              </Text>
              <Text
                style={tw`uppercase font-bold text-xs w-18 text-teal-900 dark:text-teal-600`}
              >
                Date
              </Text>
              <Text
                style={tw`uppercase font-bold text-xs w-21 text-teal-900 dark:text-teal-600`}
              >
                Amount
              </Text>
              <Text onPress={addTransaction}>
                <Plus style={tw`text-teal-900 dark:text-teal-600`} size={18} />
              </Text>
            </View>
          </>
        }
        ListHeaderComponentStyle={tw`flex items-center w-full bg-white dark:bg-zinc-900 gap-2`}
        ItemSeparatorComponent={() => (
          <View style={tw`h-[1px] bg-zinc-100 dark:bg-zinc-800 mx-2`} />
        )}
        style={tw`flex w-full`}
        contentContainerStyle={tw`flex items-center pb-5 gap-1`}
        data={sorted}
        renderItem={(transaction) => (
          <Transaction transaction={transaction.item} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Home;
