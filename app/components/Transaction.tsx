import React from "react";
import { SimpleTransaction } from "../lib";
import { Text, View, Image } from "react-native";
import tw from "twrnc";

type Props = { transaction: SimpleTransaction };

// const WEEKDAYS = [
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
//   "Sunday",
// ];

const Transaction: React.FC<Props> = ({ transaction }) => {
  const date = new Date(transaction.date);
  return (
    <View style={tw`flex flex-row items-center h-8`}>
      <View style={tw`w-1/9`}>
        {transaction.logo_url && (
          <Image
            source={{ uri: transaction.logo_url }}
            style={tw`w-7 h-7 rounded-lg`}
          />
        )}
      </View>
      <Text style={tw`grow dark:text-teal-50`}>{transaction.name}</Text>
      <Text style={tw`dark:text-teal-50`}>{createDate(transaction.date)}</Text>
      {/* <Text style={tw`dark:text-teal-50`}>{transaction.amount}</Text> */}
    </View>
  );
};

function createDate(dateString: string) {
  const date = new Date(dateString);

  // if (isWithinLastWeek(date)) {
  //   return `${WEEKDAYS[date.getDay()]}`;
  // } else {
  return `${date.getMonth()} ${date.getDate()}`;
  // }
}

// function isWithinLastWeek(targetDate: Date) {
//   const today = new Date();
//   const todayYear = today.getFullYear();
//   const todayMonth = today.getMonth();
//   const todayDate = today.getDate();

//   // Get last week's year and month
//   const lastWeekYear = todayDate <= 7 ? todayYear - 1 : todayYear;
//   const lastWeekMonth = todayDate <= 7 ? 11 : todayMonth; // December if in first week of January

//   // Get last week's day range
//   const lastWeekStart = new Date(lastWeekYear, lastWeekMonth, 24); // Assumes week starting on Monday
//   const lastWeekEnd = new Date(todayYear, todayMonth, todayDate - 1);

//   // Adjust last week start if necessary (for weeks starting on Sunday)
//   if (lastWeekStart.getDay() === 0) {
//     lastWeekStart.setDate(lastWeekStart.getDate() - 6);
//   }

//   return lastWeekStart <= targetDate && targetDate <= lastWeekEnd;
// }

export default Transaction;
