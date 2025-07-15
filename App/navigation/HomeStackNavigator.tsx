import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../pages/events/HomeScreen";
import PopularEventsPage from "../pages/events/PopularEventsPage";
import NewEventsPage from "../pages/events/NewEventsPage";
import CategoryPage from "../pages/events/CategoryPage";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BackIcon from "../assets/events/backIcon.svg";
import { View, Text } from "react-native";
import SearchPage from "../pages/events/SearchPage";

const Stack = createNativeStackNavigator();

function CustomHeaderLeftWithTitle({ title }: { title: string }) {
  const navigation = useNavigation();
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        display: "flex",
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingLeft: 8,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          display: "flex",
        }}
      >
        <View
          style={{
            width: 70.73,
            height: 28,
            justifyContent: "flex-start",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: 18,
              fontFamily: "Roboto",
              fontWeight: "700",
              lineHeight: 28,
            }}
          >
            {title}
          </Text>
        </View>
      </View>
    </View>
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
          headerLeft: () => <CustomHeaderLeftWithTitle title="인기 티켓" />,
        }}
      />
      <Stack.Screen
        name="NewEvents"
        component={NewEventsPage}
        options={{
          title: "신규 티켓",
          headerLeft: () => <CustomHeaderLeftWithTitle title="신규 티켓" />,
        }}
      />
      <Stack.Screen
        name="CategoryPage"
        component={CategoryPage}
        options={({ route }: { route: any }) => ({
          title: route.params?.categoryName || "카테고리",
          headerLeft: () => <CustomHeaderLeftWithTitle title={route.params?.categoryName || "카테고리"} />,
        })}
      />
      <Stack.Screen
        name="SearchPage"
        component={SearchPage}
        options={{
          headerLeft: () => <CustomHeaderLeftWithTitle title="검색 결과" />,
          headerTitle: "",
        }}
      />
    </Stack.Navigator>
  );
}
