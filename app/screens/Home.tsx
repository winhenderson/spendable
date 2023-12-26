import { useContext } from "react";
import { SafeAreaView } from "react-native";
import tw from "twrnc";
import Balance from "../components/Balance";
import UserContext from "../UserContext";
import TransactionsList from "../components/TransactionsList";

const Home: React.FC = () => {
  const [user] = useContext(UserContext);
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  const monthTransactions = user.transactions.filter(
    (transaction) =>
      transaction.date.split("-")[1] === String(month + 1) &&
      transaction.date.split("-")[0] === String(year)
  );

  return (
    <SafeAreaView
      style={tw`bg-teal-800 items-center justify-center flex grow p-1 gap-2`}
    >
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
