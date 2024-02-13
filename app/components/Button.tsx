import React, { ReactNode } from "react";
import { Pressable, Text } from "react-native";
import tw from "twrnc";

type Props = {
  onPress(): void;
  children: ReactNode;
  color: string;
  darkColor: string;
  style?: string;
};

const Button: React.FC<Props> = ({
  onPress,
  children,
  color,
  darkColor,
  style = "",
}) => {
  return (
    <Pressable onPress={onPress} style={tw`w-full flex-shrink`}>
      <Text
        style={tw`dark:bg-${darkColor} bg-${color} text-white text-lg font-bold uppercase p-4 overflow-hidden rounded-2xl text-center ${style}`}
      >
        {children}
      </Text>
    </Pressable>
  );
};

export default Button;
