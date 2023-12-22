import { useState } from "react";
import { Alert, SafeAreaView, Text, View } from "react-native";
import tw from "twrnc";
import { signUp, supabase } from "../lib";
import Input from "../components/Input";
import Button from "../components/Button";

type Props = {
  switchScreen(value: "login" | "signup"): void;
};

const Signup: React.FC<Props> = ({ switchScreen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        Sign Up
      </Text>

      <Input type="email" value={email} onChange={setEmail}>
        Email
      </Input>

      <Input
        type="password"
        value={password}
        onChange={setPassword}
        newPassword={true}
      >
        Password
      </Input>
      <View style={tw`flex items-center gap-1`}>
        <Button onPress={signup} color="sky-500">
          Sign Up
        </Button>

        <Text style={tw`text-white/75 text-base font-bold uppercase`}>Or</Text>

        <Button onPress={() => switchScreen("login")} color="orange-600/75">
          Log In
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Signup;
