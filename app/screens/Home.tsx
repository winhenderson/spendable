import { useContext, useState } from "react";
import { SafeAreaView } from "react-native";
import tw from "twrnc";
import Balance from "../components/Balance";
import UserContext from "../UserContext";
import TransactionsList from "../components/TransactionsList";
import MonthSwitcher from "../components/MonthSwitcher";
import Loading from "../components/Loading";
import { calculateSpent } from "../math";

const Home: React.FC = () => {
  const [user] = useContext(UserContext);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  if (!user.transactions) {
    return <Loading />;
  }

  const monthTransactions = user.transactions.filter(
    (transaction) =>
      Number(transaction.date.split("-")[1]) === month + 1 &&
      Number(transaction.date.split("-")[0]) === year
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
        spent={calculateSpent(
          // TODO: user.amount is coming through as a string but ts thinks it's a number, why is this working?
          Number(user.amount),
          monthTransactions.map((i) => i.amount)
        )}
        spendable={user.amount}
      />
      <TransactionsList transactions={monthTransactions} />
    </SafeAreaView>
  );
};

export default Home;
