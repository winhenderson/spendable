import React, { useContext, useRef, useState } from "react";
import { Pressable, TextInput, View, Text } from "react-native";
import Button from "../components/Button";
import tw from "twrnc";
import { deleteAccount, supabase, updateDefaultAmount } from "../lib";
import UserContext from "../UserContext";
import ColorSchemeContext from "../ColorSchemeContext";
import Loading from "../components/Loading";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ColorSchemeButton from "../components/ColorSchemeButton";
import { Moon, Smartphone, Sun } from "lucide-react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";

const Settings: React.FC = () => {
  const [user, setUser] = useContext(UserContext);
  const [settingColorScheme, colorScheme, setColorScheme] =
    useContext(ColorSchemeContext);
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState(String(user?.defaultSpendable));
  const [focused, setFocused] = useState(false);
  const defaultAmountRef = useRef<TextInput>(null);
  const { showActionSheetWithOptions } = useActionSheet();

  if (!user) {
    return <Loading />;
  }

  function blurInput() {
    defaultAmountRef.current?.blur();
  }

  return (
    <Pressable
      onPress={blurInput}
      style={tw`bg-white dark:bg-zinc-900 items-center flex grow gap-2 pt-[${
        insets.top + 8
      }] px-5`}
    >
      <Text style={tw`text-3xl text-teal-900 dark:text-teal-600 font-bold`}>
        Account
      </Text>
      <Text
        style={tw`w-full ml-1 mt-2 text-teal-900/80 dark:text-zinc-500 uppercase font-semibold text-sm tracking-wide`}
      >
        Default Monthly Spendable
      </Text>
      <View style={tw`w-full flex flex-row gap-6 items-center`}>
        <View style={tw`w-1/2`}>
          <TextInput
            ref={defaultAmountRef}
            style={tw`border-[1px] bg-zinc-50 dark:bg-zinc-800 text-3xl font-semibold ios:h-18 ios:px-6 android:px-6 android:py-2 rounded-2xl text-teal-900 dark:text-zinc-200 ${
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
            selected={settingColorScheme === "light"}
          >
            <Sun
              style={tw`${
                settingColorScheme === "light"
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
            selected={settingColorScheme === "dark"}
          >
            <Moon
              style={tw`${
                settingColorScheme === "dark"
                  ? "text-teal-500"
                  : "text-zinc-800 dark:text-zinc-300"
              }`}
              size={30}
            />
          </ColorSchemeButton>

          <ColorSchemeButton
            onPress={() => {
              blurInput();
              setColorScheme("system");
            }}
            selected={settingColorScheme === "system"}
          >
            <Smartphone
              style={tw`${
                settingColorScheme === "system"
                  ? "text-teal-500"
                  : "text-zinc-800 dark:text-zinc-300"
              }`}
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
            showActionSheetWithOptions(
              {
                options: ["Delete Account", "Cancel"],
                cancelButtonIndex: 1,
                destructiveButtonIndex: 0,
                userInterfaceStyle: colorScheme,
                containerStyle: tw`dark:bg-zinc-800`,
                showSeparators: true,
                separatorStyle: tw`dark:bg-zinc-600`,
                textStyle: tw`dark:text-zinc-300`,
              },
              (selectedIndex) => {
                if (selectedIndex === 1) {
                  return;
                } else {
                  setUser(null);
                  supabase.auth.signOut();
                  deleteAccount(user.id);
                }
              }
            );
          }}
          darkColor="red-700"
          color="red-600"
        >
          Delete Account
        </Button>
      </View>
    </Pressable>
  );
};

export default Settings;
