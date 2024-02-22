import React, { useContext, useRef, useState } from "react";
import { Pressable, Switch, TextInput, View, Text } from "react-native";
import Button from "../components/Button";
import tw from "twrnc";
import { deleteAccount, supabase, updateDefaultAmount } from "../lib";
import Input from "../components/Input";
import UserContext from "../UserContext";
import ColorSchemeContext from "../ColorSchemeContext";
import Loading from "../components/Loading";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ColorSchemeButton from "../components/ColorSchemeButton";
import { Moon, Smartphone, Sun } from "lucide-react-native";

const Settings: React.FC = () => {
  const [user, setUser] = useContext(UserContext);
  const [colorScheme, setColorScheme] = useContext(ColorSchemeContext);
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState(String(user?.defaultSpendable));
  const [focused, setFocused] = useState(false);
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
      style={tw`bg-white dark:bg-zinc-900 items-center flex grow gap-2 pb-[${insets.bottom}] pt-[${insets.top}] px-5`}
    >
      <Text
        style={tw`w-full ml-1 mt-8 text-teal-900/80 dark:text-zinc-500 uppercase font-semibold text-sm tracking-wide`}
      >
        Default Monthly Spendable
      </Text>
      <View style={tw`w-full flex flex-row gap-6 items-center`}>
        <View style={tw`w-1/2`}>
          <TextInput
            ref={defaultAmountRef}
            style={tw`border-[1px] h-18 bg-zinc-50 dark:bg-zinc-800 text-3xl font-semibold p-6 rounded-2xl text-teal-900 dark:text-zinc-200 ${
              focused
                ? `border-teal-500`
                : `border-zinc-300 dark:border-zinc-600`
            }`}
            onChangeText={setAmount}
            value={amount}
            keyboardType={"numeric"}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </View>

        <Button
          onPress={() => {
            blurInput();
            updateDefaultAmount(Number(amount), user.id);
            setUser({ ...user, defaultSpendable: Number(amount) });
          }}
          color="teal-800"
          darkColor="teal-700"
          small
        >
          Update Amount
        </Button>
      </View>

      <Text
        style={tw`w-full mb-4 ml-1 mt-10 text-teal-900/80 dark:text-zinc-500 uppercase font-semibold text-sm tracking-wide`}
      >
        Color Scheme
      </Text>

      <View style={tw`flex-1 w-full`}>
        <View style={tw`flex flex-row justify-between w-2/3 self-start`}>
          <ColorSchemeButton
            onPress={() => {
              blurInput();
              setColorScheme("light");
            }}
            selected={colorScheme === "light"}
          >
            <Sun
              style={tw`${
                colorScheme === "light"
                  ? "text-teal-600"
                  : "text-zinc-800 dark:text-zinc-300"
              }`}
              size={30}
            />
          </ColorSchemeButton>

          <ColorSchemeButton
            onPress={() => {
              blurInput();
              setColorScheme("dark");
            }}
            selected={colorScheme === "dark"}
          >
            <Moon
              style={tw`${
                colorScheme === "dark" ? "text-teal-500" : "text-zinc-800"
              }`}
              size={30}
            />
          </ColorSchemeButton>

          <ColorSchemeButton
            onPress={() => {
              blurInput();
              // change this
              setColorScheme("dark");
            }}
          >
            <Smartphone
              style={tw`text-zinc-800 dark:text-zinc-300`}
              size={30}
            />
          </ColorSchemeButton>
        </View>
      </View>

      <View style={tw`w-full gap-4 pb-4`}>
        <Button
          small
          onPress={() => {
            blurInput();
            setUser(null);
            supabase.auth.signOut();
          }}
          darkColor="fuchsia-900"
          color="fuchsia-700"
        >
          Sign Out
        </Button>
        <Button
          small
          onPress={() => {
            blurInput();
            setUser(null);
            supabase.auth.signOut();
            deleteAccount(user.id);
          }}
          darkColor="red-700"
          color="red-600"
        >
          Delete Account
        </Button>
      </View>
      {/* <Switch
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
      </Button> */}
    </Pressable>
  );
};

export default Settings;
