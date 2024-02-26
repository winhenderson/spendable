import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import {
  ColorScheme,
  User,
  getAllTransactions,
  getUserByAuthId,
  supabase,
} from "./lib";
import Auth from "./screens/Auth";
import { HomeIcon, LandmarkIcon, UserIcon } from "lucide-react-native";
import Account from "./screens/Account";
import { StatusBar, Text } from "react-native";
import UserContext from "./UserContext";
import Loading from "./components/Loading";
import tw, { useAppColorScheme, useDeviceContext } from "twrnc";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Banks from "./screens/Banks";
import ColorSchemeContext from "./ColorSchemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

const Tab = createBottomTabNavigator();

export default function App() {
  function getPercievedColorScheme(color: ColorScheme): "light" | "dark" {
    return color === "system"
      ? tw.prefixMatch("dark")
        ? "dark"
        : "light"
      : color;
  }

  const [selectedColorScheme, setSelectedColorScheme] =
    useState<ColorScheme>("system");
  const options =
    selectedColorScheme === "system"
      ? undefined
      : ({
          observeDeviceColorSchemeChanges: false,
          initialColorScheme: "device",
        } as const);
  useDeviceContext(tw, options);
  const [, , setAppColorScheme] = useAppColorScheme(tw);

  useEffect(() => {
    AsyncStorage.getItem("colorScheme").then((value) => {
      switch (value) {
        case "system":
        case "dark":
        case "light":
          setSelectedColorScheme(value);
          setAppColorScheme(getPercievedColorScheme(selectedColorScheme));
      }
    });
  }, [selectedColorScheme, setAppColorScheme]);

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    // AsyncStorage.clear();
    // supabase.auth.signOut();
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        getUserFromSession(data.session);
      })
      .catch(() => setUser(null));
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      getUserFromSession(session);
    });
  }, []);

  async function getUserFromSession(session: Session | null) {
    if (session) {
      const userRes = await getUserByAuthId(session.user.id);
      if (!userRes.ok) {
        return;
      }

      setUser(userRes.value);
      const res = await getAllTransactions(userRes.value.id);
      if (res.ok) {
        setUser({
          ...userRes.value,
          transactions: res.value.transactions,
          loggedOutBanks: res.value.loggedOutBanks,
        });
      }
    }
  }

  if (!session) {
    return (
      <SafeAreaProvider>
        <Auth onSignupSuccess={setUser} />
      </SafeAreaProvider>
    );
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <ActionSheetProvider>
      <SafeAreaProvider>
        <StatusBar
          backgroundColor={
            getPercievedColorScheme(selectedColorScheme) === "dark"
              ? tw.color("zinc-900")
              : "white"
          }
          barStyle={
            getPercievedColorScheme(selectedColorScheme) === "dark"
              ? "light-content"
              : "dark-content"
          }
        />
        <ColorSchemeContext.Provider
          value={[
            selectedColorScheme,
            getPercievedColorScheme(selectedColorScheme),
            (color: ColorScheme) => {
              setSelectedColorScheme(color);
              AsyncStorage.setItem("colorScheme", color);
              if (color !== "system") {
                setAppColorScheme(color);
              }
            },
          ]}
        >
          <UserContext.Provider value={[user, setUser]}>
            <NavigationContainer>
              <Tab.Navigator
                initialRouteName="Home"
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color }) => {
                    color = focused
                      ? "text-teal-500"
                      : "text-teal-900/50 dark:text-zinc-500/85";
                    const stroke = focused ? 2.5 : 1.8;
                    switch (route.name) {
                      case "Banks":
                        return (
                          <LandmarkIcon
                            style={tw`my-2 ${color}`}
                            strokeWidth={stroke}
                          />
                        );
                      case "Home":
                        return (
                          <HomeIcon
                            style={tw`my-2 ${color}`}
                            strokeWidth={stroke}
                          />
                        );
                      case "Account":
                        return (
                          <UserIcon
                            style={tw`my-2 ${color}`}
                            strokeWidth={stroke}
                          />
                        );
                    }
                  },
                  headerShown: false,
                  tabBarLabel: ({ focused, children }) => (
                    <Text
                      style={tw`${
                        focused
                          ? "text-teal-500"
                          : "text-teal-900/50 dark:text-zinc-500/85"
                      } font-bold uppercase text-[0.6rem] pb-1`}
                    >
                      {children}
                    </Text>
                  ),
                  tabBarStyle: tw`bg-white pt-2 dark:bg-zinc-800 dark:border-t-zinc-600`,
                })}
              >
                <Tab.Screen name="Banks" component={Banks} />
                <Tab.Screen name="Home" component={Home} />
                <Tab.Screen name="Account" component={Account} />
              </Tab.Navigator>
            </NavigationContainer>
          </UserContext.Provider>
        </ColorSchemeContext.Provider>
      </SafeAreaProvider>
    </ActionSheetProvider>
  );
}
