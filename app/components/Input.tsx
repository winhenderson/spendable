import React, { HTMLInputTypeAttribute, ReactNode, useState } from "react";
import { View, Text, TextInput } from "react-native";
import tw from "twrnc";

type Props = {
  type: HTMLInputTypeAttribute;
  onChange(text: string): void;
  value: string;
  newPassword?: boolean;
  placeholder: string;
  children: ReactNode;
};

const Input: React.FC<Props> = ({
  type,
  onChange,
  value,
  newPassword = false,
  placeholder,
  children,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={tw`w-1/2`}>
      <Text
        style={tw`ml-1 mb-[1/2] text-teal-900/80 uppercase font-bold text-base tracking-wide`}
      >
        {children}
      </Text>
      <TextInput
        autoCapitalize="none"
        placeholder={placeholder}
        style={tw`bg-gray-200 p-4 rounded-full text-teal-950 ${
          focused ? `border-[0.2] border-teal-500` : ``
        }`}
        onChangeText={onChange}
        value={value}
        secureTextEntry={type === "password"}
        textContentType={
          type === "email"
            ? "emailAddress"
            : newPassword
            ? "newPassword"
            : "password"
        }
        onFocus={(e) => setFocused(true)}
        onBlur={(e) => setFocused(false)}
      />
    </View>
  );
};

export default Input;
