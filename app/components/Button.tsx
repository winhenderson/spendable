import React, { ReactNode } from "react";
import { Pressable, Text } from "react-native";
import tw from "twrnc";

type Props = {
  onPress(): void;
  children: ReactNode;
  color: string;
};

const Button: React.FC<Props> = ({ onPress, children, color }) => {
  return (
    <Pressable onPress={onPress}>
      <Text
        style={tw`bg-${color} text-white text-lg font-bold uppercase p-4 overflow-hidden rounded-2xl text-center w-50`}
      >
        {children}
      </Text>
    </Pressable>
  );
};

export default Button;