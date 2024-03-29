import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import { User, signUp, supabase } from "../lib";
import Input from "../components/Input";
import Button from "../components/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onSignupSuccess(user: User): unknown;
};

const Auth: React.FC<Props> = ({ onSignupSuccess }) => {
  const insets = useSafeAreaInsets();
  const [screenShown, setScreenShown] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    if (email && password) {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });
      if (error) {
        Alert.alert(error.message);
      }
    }
  }

  async function signup() {
    if (email && password) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert(error.message);
      }

      if (!data.user) {
        return;
      }

      console.log({ data });

      if (data) {
        const user = await signUp(email, data.user.id);
        if (!user.ok) {
          return;
        }
        onSignupSuccess(user.value);
      }
    }
  }

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      scrollEnabled={false}
      style={tw`pb-[${insets.bottom}] pt-[${
        insets.top + 20
      }] dark:bg-zinc-900 bg-white`}
    >
      <View
        style={tw`bg-white dark:bg-zinc-900 flex flex-col items-center justify-center grow-1 gap-4 w-2/3 m-auto`}
      >
        <Text
          style={tw`text-4xl font-bold uppercase text-teal-600 dark:text-teal-500 mb-10`}
        >
          Spendable
        </Text>
        <Text
          style={tw`mb-10 text-3xl w-2/3 text-center tracking-wide font-bold dark:text-teal-500`}
        >
          {screenShown === "login" ? "Log In" : "Sign Up"}
        </Text>

        <Input
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Email"
          onSubmit={screenShown === "signup" ? signup : login}
        >
          Email
        </Input>

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
          newPassword={screenShown === "signup"}
          onSubmit={screenShown === "signup" ? signup : login}
        >
          Password
        </Input>

        <View style={tw`flex items-center gap-1 w-3/4`}>
          <Button
            onPress={screenShown === "login" ? login : signup}
            color="sky-500"
            darkColor="sky-500"
            disabled={password !== "" && email !== "" ? false : true}
          >
            {screenShown === "login" ? "Log In" : "Sign Up"}
          </Button>

          <Pressable
            style={tw`mt-2 flex flex-row items-center`}
            onPress={() =>
              setScreenShown(screenShown === "login" ? "signup" : "login")
            }
          >
            <Text style={tw`uppercase  text-base text-zinc-500`}>Or – </Text>
            <Text
              style={tw`underline text-base text-teal-900 font-bold tracking-wide dark:text-teal-600`}
            >
              {screenShown === "signup" ? "Log In" : "Create Account"}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default Auth;
