import React from "react";
import { User } from "./lib";

const UserContext = React.createContext<[User, (user: User) => unknown]>([
  {
    id: "",
    email: "",
    amount: 0,
    transactions: [],
  },
  () => {},
]);

export default UserContext;
