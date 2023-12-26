import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import { useCallback, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import {
  SimpleTransaction,
  User,
  createLinkToken,
  getUserById,
  supabase,
  transactionsSync,
} from "./lib";
import Auth from "./screens/Auth";
import { HomeIcon, SettingsIcon } from "lucide-react-native";
import Settings from "./screens/Settings";

const Tab = createBottomTabNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [linkToken, setLinkToken] = useState<string>();
  const [user, setUser] = useState<User>();
  // const [transactions, setTransactions] = useState<Array<SimpleTransaction>>(
  // []
  // );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  }, []);

  // TODO: move this into settings.tsx
  const createNewLinkToken = useCallback(async () => {
    const token = await createLinkToken();
    setLinkToken(token);
  }, [setLinkToken]);

  useEffect(() => {
    if (linkToken === undefined) {
      createNewLinkToken();
    }
  }, [linkToken]);

  const getUserFromSession = useCallback(async () => {
    if (session) {
      const response = await getUserById(session.user.id);
      setUser(response);
    }
  }, [setUser, session, user]);

  // const getTransactions = useCallback(async () => {
  //   if (user) {
  //     const data = await transactionsSync(user.id);
  //     setTransactions(data);
  //   }
  // }, [user, setTransactions]);

  useEffect(() => {
    if (!user) {
      // TODO: fix this race condition? i think the database isn't updating as fast as the useEffect is getting called after a signup
      setTimeout(() => {
        getUserFromSession();
      }, 2000);
    }
    // getTransactions();
    // getUserFromSession();
    // }
  }, [user]);

  function SettingsScreen() {
    if (!user || !linkToken) {
      throw new Error("need user and link token to render settings screen");
    }
    return <Settings user={user} linkToken={linkToken} />;
  }

  function HomeScreen() {
    if (!user) {
      throw new Error("Home screen shouldn't be rendered without a user");
    }
    return <Home user={user} />;
  }

  return (
    <NavigationContainer>
      {session && session.user && user ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              switch (route.name) {
                case "Home":
                  return <HomeIcon color="white" />;
                case "Settings":
                  return <SettingsIcon color="white" />;
              }
            },
            tabBarShowLabel: false,
            headerShown: false,
            tabBarStyle: { backgroundColor: "#042f2e" },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      ) : (
        <Auth />
      )}
    </NavigationContainer>
  );
}
