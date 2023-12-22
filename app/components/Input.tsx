import React, { HTMLInputTypeAttribute, ReactNode } from "react";
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
  return (
    <View style={tw`w-1/2`}>
      <Text
        style={tw`ml-1 mb-[1/2] text-white/85 uppercase font-bold text-base tracking-wide`}
      >
        {children}
      </Text>
      <TextInput
        autoCapitalize="none"
        placeholder={placeholder}
        style={tw`bg-teal-900 p-4 rounded-full text-white`}
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
      />
    </View>
  );
};

export default Input;
