import React, { ReactNode } from "react";
import { Pressable, Text } from "react-native";
import tw from "twrnc";

type Props = {
  onPress(): void;
  children: ReactNode;
  color: string;
  style?: string;
};

const Button: React.FC<Props> = ({ onPress, children, color, style = "" }) => {
  return (
    <Pressable onPress={onPress} style={tw`min-w-full`}>
      <Text
        style={tw`bg-${color} text-white text-lg font-bold uppercase p-4 overflow-hidden rounded-2xl text-center ${style}`}
      >
        {children}
      </Text>
    </Pressable>
  );
};

export default Button;
