import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native";
import Button from "../components/Button";
import tw from "twrnc";
import { supabase, updateAmount } from "../lib";
import Input from "../components/Input";
import UserContext from "../UserContext";

const Settings: React.FC = () => {
  const [user, setUser] = useContext(UserContext);

  const [amount, setAmount] = useState(String(user.amount));

  return (
    <SafeAreaView
      style={tw`bg-white items-center justify-center flex grow p-1 gap-2`}
    >
      <Input
        type="number"
        placeholder="2000"
        onChange={setAmount}
        value={amount}
      >
        Spendable Amount
      </Input>
      <Button
        onPress={() => {
          updateAmount(Number(amount), user.id);
          setUser({ ...user, amount: Number(amount) });
        }}
        color="purple-800"
        style="text-sm"
      >
        Update Amount
      </Button>

      <Button
        onPress={() => {
          supabase.auth.signOut();
        }}
        color="red-700"
        style="text-sm"
      >
        Sign Out
      </Button>
    </SafeAreaView>
  );
};

export default Settings;
