import { useState } from "react";
import { Alert, Pressable, SafeAreaView, Text, View } from "react-native";
import tw from "twrnc";
import { signUp, supabase } from "../lib";
import Input from "../components/Input";
import Button from "../components/Button";

const Auth: React.FC = () => {
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

      if (data) {
        signUp(email, data.user.id);
      }
    }
  }

  return (
    <SafeAreaView
      style={tw`bg-teal-800 flex flex-col items-center justify-center grow-1 gap-4`}
    >
      <Text
        style={tw`mb-10 text-white text-3xl w-2/3 text-center tracking-wide font-bold `}
      >
        {screenShown === "login" ? "Log In" : "Sign Up"}
      </Text>

      <Input type="email" value={email} onChange={setEmail} placeholder="Email">
        Email
      </Input>

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={setPassword}
        newPassword={screenShown === "signup"}
      >
        Password
      </Input>

      <View style={tw`flex items-center gap-1`}>
        <Button
          onPress={screenShown === "login" ? login : signup}
          color="sky-500"
        >
          {screenShown === "login" ? "Log In" : "Sign Up"}
        </Button>

        <Text style={tw`text-white/75 text-base  font-bold uppercase`}>Or</Text>

        <Button
          onPress={() =>
            setScreenShown(screenShown === "login" ? "signup" : "login")
          }
          color="orange-600/75"
        >
          {screenShown === "signup" ? "Log In" : "Sign Up"}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Auth;
