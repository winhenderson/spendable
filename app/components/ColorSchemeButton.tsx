import React, { ReactNode } from "react";
import { Pressable } from "react-native";
import tw from "twrnc";

type Props = {
  children: ReactNode;
  selected?: boolean;
  onPress(): unknown;
};

const ColorSchemeButton: React.FC<Props> = ({
  children,
  onPress,
  selected = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={tw`p-3 rounded-full border-[1px] ${
        selected ? "border-2 border-teal-500" : "border-zinc-500"
      }`}
    >
      {children}
    </Pressable>
  );
};

export default ColorSchemeButton;
