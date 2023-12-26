import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { User, getUserById, supabase, transactionsSync } from "./lib";
import Auth from "./screens/Auth";
import { HomeIcon, SettingsIcon } from "lucide-react-native";
import Settings from "./screens/Settings";
import { Text } from "react-native";
import UserContext from "./UserContext";
import Loading from "./components/Loading";
import tw from "twrnc";

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
    <UserContext.Provider value={[user, setUser]}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              color = focused ? "white" : "gray";
              switch (route.name) {
                case "Home":
                  return <HomeIcon color={color} style={tw`my-2`} />;
                case "Settings":
                  return <SettingsIcon color={color} style={tw`my-2`} />;
              }
            },
            headerShown: false,
            tabBarLabel: ({ focused, children }) => (
              <Text
                style={tw`${
                  focused ? "text-white" : "text-gray-400"
                } font-bold uppercase text-[0.6rem]`}
              >
                {children}
              </Text>
            ),
            tabBarStyle: {
              backgroundColor: "#042f2e",
              borderTopWidth: 0,
              height: 80,
            },
          })}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}
