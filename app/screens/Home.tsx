import { useCallback, useContext, useState } from "react";
import { FlatList, View, Text, Alert, RefreshControl } from "react-native";
import tw from "twrnc";
import Balance from "../components/Balance";
import UserContext from "../UserContext";
import MonthSwitcher from "../components/MonthSwitcher";
import Loading from "../components/Loading";
import { calculateSpent } from "../math";
import MonthInfo from "../components/MonthInfo";
import Transaction from "../components/Transaction";
import { getAllTransactions, isCurrentMonth, updateMonthAmount } from "../lib";
import { Plus } from "lucide-react-native";
import ColorSchemeContext from "../ColorSchemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GestureRecognizer from "react-native-swipe-gestures";

const Home: React.FC = () => {
  const [colorScheme] = useContext(ColorSchemeContext);
  const [user, setUser] = useContext(UserContext);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState(
    user?.months[`${month.toString().padStart(2, "0")}-${year}`] ??
      user?.defaultSpendable ??
      0
  );

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

  const monthIsCurrent = isCurrentMonth(new Date(year, month));
  const monthIsLast =
    firstTransaction.month === month && firstTransaction.year === year;

  function forwardMonth() {
    if (monthIsCurrent) {
      return;
    }
    let newYear = year;
    let newMonth;
    if (month === 11) {
      newYear = year + 1;
      newMonth = 0;
    } else {
      newMonth = month + 1;
    }
    setAmount(
      user?.months[`${newMonth.toString().padStart(2, "0")}-${newYear}`] ??
        user?.defaultSpendable ??
        0
    );
    setMonth(newMonth);
    setYear(newYear);
  }

  function backwardMonth() {
    if (monthIsLast) {
      return;
    }
    let newMonth;
    let newYear;
    if (month === 0) {
      newYear = year - 1;
      newMonth = 11;
    } else {
      newYear = year;
      newMonth = month - 1;
    }
    setAmount(
      user?.months[`${newMonth.toString().padStart(2, "0")}-${newYear}`] ??
        user?.defaultSpendable ??
        0
    );
    setMonth(newMonth);
    setYear(newYear);
  }

  return (
    <GestureRecognizer
      config={{ velocityThreshold: 0.3, directionalOffsetThreshold: 30 }}
      onSwipeLeft={() => forwardMonth()}
      onSwipeRight={() => backwardMonth()}
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
              forwardMonth={forwardMonth}
              backwardMonth={backwardMonth}
              month={month}
              monthIsCurrent={monthIsCurrent}
              monthIsLast={monthIsLast}
            />
            <Balance spent={spent} spendable={amount} />
            <MonthInfo
              updateMonthlySpendable={(newAmount: number) => {
                setAmount(newAmount);
                updateMonthAmount(newAmount, user.id, month, year);
              }}
              spendable={amount}
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
    </GestureRecognizer>
  );
};

export default Home;
