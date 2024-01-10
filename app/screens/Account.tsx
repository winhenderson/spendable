import React, { useContext, useState } from "react";
import { SafeAreaView, Switch } from "react-native";
import Button from "../components/Button";
import tw from "twrnc";
import { supabase, updateAmount } from "../lib";
import Input from "../components/Input";
import UserContext from "../UserContext";
import ColorSchemeContext from "../ColorSchemeContext";
import Loading from "../components/Loading";

const Settings: React.FC = () => {
  const [user, setUser] = useContext(UserContext);
  const [colorScheme, setColorScheme] = useContext(ColorSchemeContext);

  const [amount, setAmount] = useState(String(user?.amount));
  if (!user) {
    return <Loading />;
  }

  return (
    <SafeAreaView
      style={tw`bg-white dark:bg-zinc-900 items-center justify-center flex grow p-1 gap-2`}
    >
      <Switch
        onValueChange={(value) => {
          setColorScheme(value ? "dark" : "light");
        }}
        value={colorScheme === "dark"}
        trackColor={{ false: "#042f2e", true: "#0d9488" }}
      />
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
          setUser(null);
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
