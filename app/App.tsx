import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { User, getUserById, supabase, transactionsSync } from "./lib";
import Auth from "./screens/Auth";
import { HomeIcon, LandmarkIcon, UserIcon } from "lucide-react-native";
import Settings from "./screens/Account";
import { Text } from "react-native";
import UserContext from "./UserContext";
import Loading from "./components/Loading";
import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";
import Banks from "./screens/Banks";

const Tab = createBottomTabNavigator();

export default function App() {
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
      <UserContext.Provider value={[user, setUser]}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                color = focused ? "teal-500" : "teal-900/50";
                const stroke = focused ? 2.5 : 1.8;
                switch (route.name) {
                  case "Banks":
                    return (
                      <LandmarkIcon
                        style={tw`my-2 text-${color}`}
                        strokeWidth={stroke}
                      />
                    );
                  case "Home":
                    return (
                      <HomeIcon
                        style={tw`my-2 text-${color}`}
                        strokeWidth={stroke}
                      />
                    );
                  case "Account":
                    return (
                      <UserIcon
                        style={tw`my-2 text-${color}`}
                        strokeWidth={stroke}
                      />
                    );
                }
              },
              headerShown: false,
              tabBarLabel: ({ focused, children }) => (
                <Text
                  style={tw`${
                    focused ? "text-teal-500" : "text-teal-900/50"
                  } font-bold uppercase text-[0.6rem] pb-1`}
                >
                  {children}
                </Text>
              ),
              tabBarStyle: {
                backgroundColor: "#fefefe",
                paddingTop: 5,
              },
            })}
          >
            <Tab.Screen name="Banks" component={Banks} />
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Account" component={Settings} />
          </Tab.Navigator>
        </NavigationContainer>
      </UserContext.Provider>
    </SafeAreaView>
  );
}
