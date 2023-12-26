import { useContext } from "react";
import { SafeAreaView } from "react-native";
import tw from "twrnc";
import Balance from "../components/Balance";
import UserContext from "../UserContext";

const Home: React.FC = () => {
  const [user] = useContext(UserContext);

  return (
    <SafeAreaView
      style={tw`bg-teal-800 items-center justify-center flex grow p-1 gap-2`}
    >
      <Balance
        spent={
          Number(
            user.transactions
              .map((i) => i.amount)
              .reduce((total, amount) => total + amount, 0)
              .toFixed(2)
          ) * -1
        }
        spendable={user.amount}
      />
    </SafeAreaView>
  );
};

export default Home;
