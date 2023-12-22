import { useState } from "react";
import { Alert, Pressable, SafeAreaView, Text } from "react-native";
import tw from "twrnc";
import { supabase } from "../lib";
import Input from "../components/Input";
import Button from "../components/Button";

type Props = {
  switchScreen(value: "login" | "signup"): void;
};

const Login: React.FC<Props> = ({ switchScreen }) => {
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

  return (
    <SafeAreaView
      style={tw`bg-teal-800 flex flex-col items-center justify-center grow-1`}
    >
      <Text
        style={tw`mb-10 text-white text-3xl w-2/3 text-center tracking-wide font-bold `}
      >
        Log In
      </Text>

      <Input type="email" value={email} onChange={setEmail}>
        Email
      </Input>

      <Input type="password" value={password} onChange={setPassword}>
        Password
      </Input>

      <Button onPress={login} color="sky-500">
        Log In
      </Button>

      <Text style={tw`text-white/75 text-base  font-bold uppercase my-1`}>
        Or
      </Text>

      <Button onPress={() => switchScreen("signup")} color="orange-600/75">
        Sign Up
      </Button>
    </SafeAreaView>
  );
};

export default Login;
