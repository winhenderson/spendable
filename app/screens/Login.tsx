import { useState } from "react";
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import tw from "twrnc";
import { findUserByEmail, supabase } from "../lib";

export default function Auth() {
  const [user, setUser] = useState<string | undefined>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // async function signInWithEmail() {
  //   const { error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   });
  // }

  return (
    <SafeAreaView
      style={tw`bg-teal-800 flex flex-col items-center justify-center grow-1`}
    >
      <Text
        style={tw`mb-10 text-white text-3xl w-2/3 text-center tracking-wide uppercase font-bold `}
      >
        Login or Signup
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

      {user !== undefined &&
        (user ? (
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
        ) : (
          <View style={tw`w-1/2`}>
            <Text style={tw`text-white/85 uppercase font-semibold text-lg`}>
              Create Password:
            </Text>
            <TextInput
              placeholder="New Password"
              style={tw`bg-teal-900 p-4 rounded-full text-white`}
              onChangeText={setPassword}
              value={password}
              textContentType="newPassword"
            />
          </View>
        ))}

      <Pressable
        onPress={async () => {
          if (email) {
            setUser((await findUserByEmail(email)).email);
          }
        }}
      >
        <Text
          style={tw`bg-sky-500 text-white text-md font-bold uppercase p-4 overflow-hidden rounded-2xl text-center w-50 mt-4`}
        >
          Continue
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
