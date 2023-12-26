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

const Tab = createBottomTabNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User>();

  useEffect(() => {
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
    return <Text>Laoding</Text>;
  }

  return (
    <UserContext.Provider value={[user, setUser]}>
      <NavigationContainer>
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
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}
