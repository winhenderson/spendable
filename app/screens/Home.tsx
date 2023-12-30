import { useContext, useState } from "react";
import { SafeAreaView } from "react-native";
import tw from "twrnc";
import Balance from "../components/Balance";
import UserContext from "../UserContext";
import TransactionsList from "../components/TransactionsList";
import MonthSwitcher from "../components/MonthSwitcher";

const Home: React.FC = () => {
  const [user] = useContext(UserContext);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const monthTransactions = user.transactions.filter(
    (transaction) =>
      Number(transaction.date.split("-")[1]) === month + 1 &&
      Number(transaction.date.split("-")[0]) === year
  );

  const firstTransactionDate = user.transactions.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return Number(dateA) - Number(dateB);
  })[0].date;

  const firstTransaction = {
    month: Number(firstTransactionDate.split("-")[1]) - 1,
    year: Number(firstTransactionDate.split("-")[0]),
  };

  return (
    <SafeAreaView
      style={tw`bg-white dark:bg-zinc-900 items-center justify-center flex grow p-1 gap-2`}
    >
      <MonthSwitcher
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
        firstTransaction={firstTransaction}
      />
      <Balance
        spent={
          Number(
            monthTransactions
              .map((i) => i.amount)
              .reduce((total, amount) => total + amount, 0)
              .toFixed(2)
          ) * -1
        }
        spendable={user.amount}
      />
      <TransactionsList transactions={monthTransactions} />
    </SafeAreaView>
  );
};

export default Home;
