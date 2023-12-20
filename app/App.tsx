import "react-native-url-polyfill/auto";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import { useEffect, useState } from "react";
import Login from "./screens/Login";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./lib";
import Signup from "./screens/Signup";

const Tab = createBottomTabNavigator();

export default function App() {
  const [authScreenShown, setAuthScreenShown] = useState<"login" | "signup">(
    "signup"
  );

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <NavigationContainer>
      {session && session.user ? (
        <Home session={session} />
      ) : authScreenShown === "login" ? (
        <Login switchScreen={setAuthScreenShown} />
      ) : (
        <Signup switchScreen={setAuthScreenShown} />
      )}
    </NavigationContainer>
  );
}
