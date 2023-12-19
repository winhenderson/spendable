import "react-native-url-polyfill/auto";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import Auth from "./screens/Login";
import { useState } from "react";
import Login from "./screens/Login";

const Tab = createBottomTabNavigator();

export default function App() {
  const [userToken, setUserToken] = useState("");

  return (
    <NavigationContainer>
      {userToken == "" ? (
        <Login />
      ) : (
        // <Tab.Navigator>
        //   <Tab.Screen name="Home" component={Home} />
        // </Tab.Navigator>
        <Home />
      )}
    </NavigationContainer>
  );
}
