import React, { useContext, useRef, useState } from "react";
import { Pressable, Switch, TextInput, View } from "react-native";
import Button from "../components/Button";
import tw from "twrnc";
import { deleteAccount, supabase, updateDefaultAmount } from "../lib";
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
  const defaultAmountRef = useRef<TextInput>(null);

  if (!user) {
    return <Loading />;
  }

  function blurInput() {
    defaultAmountRef.current?.blur();
  }

  return (
    <Pressable
      onPress={blurInput}
      style={tw`bg-white dark:bg-zinc-900 items-center justify-center flex grow gap-2 pb-[${insets.bottom}] pt-[${insets.top}] p-10`}
    >
      <Switch
        onValueChange={(value) => {
          blurInput();
          setColorScheme(value ? "dark" : "light");
        }}
        value={colorScheme === "dark"}
        trackColor={{ false: "#042f2e", true: "#0d9488" }}
      />
      <View style={tw`z-20 w-full`}>
        <Input
          ref={defaultAmountRef}
          type="number"
          placeholder="2000"
          onChange={setAmount}
          value={amount}
        >
          Spendable Amount
        </Input>
      </View>
      <Button
        onPress={() => {
          blurInput();
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
          blurInput();
          setUser(null);
          supabase.auth.signOut();
        }}
        darkColor="red-800"
        color="red-700"
      >
        Sign Out
      </Button>
      <Button
        onPress={() => {
          blurInput();
          setUser(null);
          supabase.auth.signOut();
          deleteAccount(user.id);
        }}
        darkColor="fuchsia-700"
        color="fuchsia-600"
      >
        Delete Account
      </Button>
    </Pressable>
  );
};

export default Settings;
