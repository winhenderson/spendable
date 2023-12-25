import React from "react";
import { View, Text } from "react-native";

type Props = {
  spent: number;
  spendable: number;
};

const Balance: React.FC<Props> = ({ spent, spendable }) => {
  return (
    <View>
      <Text>{spendable}</Text>
      <Text>{spent}</Text>
    </View>
  );
};

export default Balance;
