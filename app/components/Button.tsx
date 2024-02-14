import React, { ReactNode } from "react";
import { Pressable, Text } from "react-native";
import tw from "twrnc";

type Props = {
  onPress(): void;
  children: ReactNode;
  color: string;
  darkColor: string;
  small?: boolean;
  disabled?: boolean;
};

const Button: React.FC<Props> = ({
  onPress,
  children,
  color,
  darkColor,
  small = false,
  disabled = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={tw`w-full flex-shrink`}
      disabled={disabled}
    >
      <Text
        style={tw`
        dark:bg-${darkColor} bg-${color} text-white font-bold uppercase p-4 ${
          small ? "text-sm" : "text-lg"
        } overflow-hidden rounded-2xl text-center
${disabled ? "bg-opacity-50" : ""}
        `}
      >
        {children}
      </Text>
    </Pressable>
  );
};

export default Button;
