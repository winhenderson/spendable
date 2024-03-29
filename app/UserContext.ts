import React from "react";
import { User } from "./lib";

const UserContext = React.createContext<
  [User | null, (user: User | null) => unknown]
>([
  {
    id: "",
    email: "",
    defaultSpendable: 0,
    transactions: [],
    months: {},
    banks: [],
    loggedOutBanks: [],
  },
  () => {},
]);

export default UserContext;
