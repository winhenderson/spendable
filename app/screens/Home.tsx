import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, Text, View, Pressable } from "react-native";
import PlaidLink, { LinkExit, LinkSuccess } from "react-native-plaid-link-sdk";
import tw from "twrnc";
import {
  SimpleTransaction,
  User,
  createLinkToken,
  getUserById,
  publicTokenExchange,
  supabase,
  transactionsSync,
  updateAmount,
} from "../lib";
import { Session } from "@supabase/supabase-js";
import Button from "../components/Button";
import Input from "../components/Input";
import Balance from "../components/Balance";

type Props = {
  // session: Session;
  user: User;
  // transactions: Array<SimpleTransaction>;
};

const Home: React.FC<Props> = ({ user }) => {
  console.log({ user });
  const [transactions, setTransactions] = useState<SimpleTransaction[]>([]);

  const getTransactions = useCallback(async () => {
    const data = await transactionsSync(user.id);
    setTransactions(data);
  }, [user, setTransactions]);

  useEffect(() => {
    getTransactions();
  }, [user]);

  // const [user, setUser] = useState<User>();
  // const [amount, setAmount] = useState(user?.amount ? String(user.amount) : "");
  // // const [linkToken, setLinkToken] = useState<string>();

  // const createNewLinkToken = useCallback(async () => {
  //   const token = await createLinkToken();
  //   setLinkToken(token);
  // }, [setLinkToken]);

  // useEffect(() => {
  //   if (linkToken === undefined) {
  //     createNewLinkToken();
  //   }
  // }, [linkToken]);

  // const getUserFromSession = useCallback(async () => {
  //   const response = await getUserById(session.user.id);
  //   setUser(response);
  // }, [setUser, session]);

  // useEffect(() => {
  //   if (!user) {
  //     // TODO: fix this race condition? i think the database isn't updating as fast as the useEffect is getting called after a signup
  //     setTimeout(() => {
  //       getUserFromSession();
  //     }, 2000);
  //   }
  // }, [user]);

  // TODO: make this better
  // if (!linkToken) {
  //   return;
  // }

  return (
    <SafeAreaView
      style={tw`bg-teal-800 items-center justify-center flex grow p-1 gap-2`}
    >
      <Balance
        spent={
          Number(
            transactions
              .map((i) => i.amount)
              .reduce((total, amount) => total + amount, 0)
              .toFixed(2)
          ) * -1
        }
        spendable={user.amount}
      />
    </SafeAreaView>
  );
  //     ) : (
  //       ""
  //     )}
  //     <Input
  //       type="number"
  //       placeholder="2000"
  //       onChange={setAmount}
  //       value={amount}
  //     >
  //       Spendable Amount
  //     </Input>

  //     <Button
  //       onPress={() => {
  //         updateAmount(Number(amount), user.id);
  //         // setUser({ ...user, amount: Number(amount) });
  //       }}
  //       color="purple-800"
  //       style="text-sm"
  //     >
  //       Update Amount
  //     </Button>

  /* <PlaidLink
        tokenConfig={{
          token: linkToken,
          noLoadingState: false,
        }}
        onSuccess={async (success: LinkSuccess) => {
          publicTokenExchange(success.publicToken, session.user.id);
          const data = await transactionsSync(session.user.id);
          setTransactions(data);
        }}
        onExit={(exit: LinkExit) => console.log(exit)}
      >
        <Text
          style={tw`bg-orange-600 p-4 text-white font-bold uppercase overflow-hidden rounded-2xl w-50 text-center`}
        >
          Add Account
        </Text>
      </PlaidLink>
 */
  /* <Button
        onPress={async () => {
          const data = await transactionsSync(user.id);
          setTransactions(data);
        }}
        color="indigo-900"
        style="text-sm"
      >
        Get Transactions
      </Button> */

  /* {transactions.length ? (
        <View>
          <Text
            style={tw`font-bold text-lg mt-4 text-gray-300 uppercase text-center`}
          >
            Total Spent:
          </Text>
          <Text style={tw`text-white font-extrabold text-4xl`}>
            $
            {Number(
              transactions
                .map((i) => i.amount)
                .reduce((total, amount) => total + amount)
                .toFixed(2)
            ) * -1}
          </Text>
        </View>
      ) : (
        ""
      )} */

  /* <Button
        onPress={() => {
          supabase.auth.signOut();
        }}
        color="red-700"
        style="text-sm"
      >
        Sign Out
      </Button> */
  // <Text>"Loading"</Text>
};

export default Home;
