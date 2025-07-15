import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../pages/events/HomeScreen";
import PopularEventsPage from "../pages/events/PopularEventsPage";
import NewEventsPage from "../pages/events/NewEventsPage";
import CategoryPage from "../pages/events/CategoryPage";
import SearchPage from "../pages/events/SearchPage";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BackIcon from "../assets/events/backIcon.svg";

const Stack = createNativeStackNavigator();

export function CustomBackButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{ marginLeft: 16 }}
    >
      <BackIcon width={24} height={24} />
    </TouchableOpacity>
  );
}

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PopularEvents"
        component={PopularEventsPage}
        options={{
          title: "인기 티켓",
          headerLeft: () => <CustomBackButton />,
        }}
      />
      <Stack.Screen
        name="NewEvents"
        component={NewEventsPage}
        options={{
          title: "신규 티켓",
          headerLeft: () => <CustomBackButton />,
        }}
      />
      <Stack.Screen
        name="CategoryPage"
        component={CategoryPage}
        options={({ route }: { route: any }) => ({
          title: route.params?.categoryName || "카테고리",
          headerLeft: () => <CustomBackButton />,
        })}
      />
      <Stack.Screen
        name="SearchPage"
        component={SearchPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
