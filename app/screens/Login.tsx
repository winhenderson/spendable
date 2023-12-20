import { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import tw from "twrnc";
import { supabase } from "../lib";

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

      <View style={tw`w-1/2`}>
        <Text style={tw`text-white/85 uppercase font-semibold text-lg`}>
          Email:
        </Text>
        <TextInput
          placeholder="Email"
          style={tw`bg-teal-900 p-4 rounded-full text-white`}
          onChangeText={setEmail}
          value={email}
          textContentType="emailAddress"
        />
      </View>

      <View style={tw`w-1/2 `}>
        <Text style={tw`text-white/85 uppercase font-semibold text-lg`}>
          Password:
        </Text>
        <TextInput
          placeholder="Password"
          style={tw`bg-teal-900 p-4 rounded-full text-white`}
          onChangeText={setPassword}
          value={password}
          textContentType="password"
        />
      </View>

      <Pressable onPress={login}>
        <Text
          style={tw`bg-sky-500 text-white text-lg font-bold uppercase p-4 overflow-hidden rounded-2xl text-center w-50 mt-4`}
        >
          Log In
        </Text>
      </Pressable>

      <Pressable onPress={() => switchScreen("signup")}>
        <Text>Don't have an account? Sign up!</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Login;
