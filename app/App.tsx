import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { User, getUserById, supabase, transactionsSync } from "./lib";
import Auth from "./screens/Auth";
import { HomeIcon, LandmarkIcon, UserIcon } from "lucide-react-native";
import Account from "./screens/Account";
import { Text } from "react-native";
import UserContext from "./UserContext";
import Loading from "./components/Loading";
import tw, { useAppColorScheme, useDeviceContext } from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";
import Banks from "./screens/Banks";
import ColorSchemeContext from "./ColorSchemeContext";

const Tab = createBottomTabNavigator();

export default function App() {
  // 1️⃣  opt OUT of listening to DEVICE color scheme events
  useDeviceContext(tw, { withDeviceColorScheme: false });

  // 2️⃣  use the `useAppColorScheme` hook to get a reference to the current color
  // scheme, with some functions to modify it (triggering re-renders) when you need to
  const [colorScheme, toggleColorScheme, setColorScheme] =
    useAppColorScheme(tw);

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    // supabase.auth.signOut();
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      getUserFromSession(data.session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      getUserFromSession(session);
    });
  }, []);

  async function getUserFromSession(session: Session | null) {
    if (session) {
      const user = await getUserById(session.user.id);
      console.log("getting transactions");
      const transactions = await transactionsSync(user.id);
      setUser({ ...user, transactions });
    }
  }

  if (!session) {
    return <Auth onSignupSuccess={setUser} />;
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={tw`h-full`}>
      <ColorSchemeContext.Provider
        value={[colorScheme ?? "dark", setColorScheme]}
      >
        <UserContext.Provider value={[user, setUser]}>
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName="Account"
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  color = focused
                    ? "text-teal-500 dark:text-teal-600"
                    : "text-teal-900/50 dark:text-zinc-500/75";
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
                        ? "text-teal-500 dark:text-teal-600"
                        : "text-teal-900/50 dark:text-zinc-500/75"
                    } font-bold uppercase text-[0.6rem] pb-1`}
                  >
                    {children}
                  </Text>
                ),
                // tabBarStyle: {
                //   backgroundColor: tw`"#fefefe"`,
                //   paddingTop: 5,
                // },
                tabBarStyle: tw`bg-white pt-2 dark:bg-zinc-800`,
              })}
            >
              <Tab.Screen name="Banks" component={Banks} />
              <Tab.Screen name="Home" component={Home} />
              <Tab.Screen name="Account" component={Account} />
            </Tab.Navigator>
          </NavigationContainer>
        </UserContext.Provider>
      </ColorSchemeContext.Provider>
    </SafeAreaView>
  );
}
