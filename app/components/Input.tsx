import React, {
  HTMLInputTypeAttribute,
  ReactNode,
  Ref,
  forwardRef,
  useState,
} from "react";
import { View, Text, TextInput } from "react-native";
import tw from "twrnc";

type Props = {
  type: HTMLInputTypeAttribute;
  onChange(text: string): void;
  value: string;
  newPassword?: boolean;
  placeholder: string;
  ref?: Ref<TextInput>;
  children: ReactNode;
};

const Input: React.FC<Props> = forwardRef(function Input(
  { type, onChange, value, newPassword = false, placeholder, children },
  ref
) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={tw`w-full`}>
      <Text
        style={tw`ml-1 mb-1 text-teal-900/80 dark:text-zinc-500 uppercase font-semibold text-sm tracking-wide`}
      >
        {children}
      </Text>
      <TextInput
        ref={ref}
        autoCapitalize={
          type === "email" || type === "password" ? "none" : "words"
        }
        placeholder={placeholder}
        placeholderTextColor={"gray"}
        style={tw`bg-gray-200 dark:bg-zinc-800 p-4 rounded-full text-teal-950 dark:text-zinc-200 ${
          focused ? `border-[0.2] border-teal-500` : ``
        }`}
        onChangeText={onChange}
        value={value}
        secureTextEntry={type === "password"}
        keyboardType={
          type === "email"
            ? "email-address"
            : type === "number"
            ? "numeric"
            : "default"
        }
        textContentType={
          type === "email"
            ? "emailAddress"
            : type === "password"
            ? newPassword
              ? "newPassword"
              : "password"
            : "none"
        }
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
});

export default Input;
