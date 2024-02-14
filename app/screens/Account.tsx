import React, { useContext, useState } from "react";
import { Switch, View } from "react-native";
import Button from "../components/Button";
import tw from "twrnc";
import { supabase, updateDefaultAmount } from "../lib";
import Input from "../components/Input";
import UserContext from "../UserContext";
import ColorSchemeContext from "../ColorSchemeContext";
import Loading from "../components/Loading";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Settings: React.FC = () => {
  const [user, setUser] = useContext(UserContext);
  const [colorScheme, setColorScheme] = useContext(ColorSchemeContext);
  const insets = useSafeAreaInsets();

  const [amount, setAmount] = useState(String(user?.defaultSpendable));
  if (!user) {
    return <Loading />;
  }

  return (
    <View
      style={tw`bg-white dark:bg-zinc-900 items-center justify-center flex grow p-1 gap-2 pb-[${insets.bottom}] pt-[${insets.top}]`}
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
          updateDefaultAmount(Number(amount), user.id);
          setUser({ ...user, defaultSpendable: Number(amount) });
        }}
        color="purple-800"
        darkColor="purple-900"
      >
        Update Amount
      </Button>

      <Button
        onPress={() => {
          setUser(null);
          supabase.auth.signOut();
        }}
        darkColor="red-800"
        color="red-700"
      >
        Sign Out
      </Button>
    </View>
  );
};

export default Settings;
