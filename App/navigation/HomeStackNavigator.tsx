import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../pages/events/HomeScreen";
import PopularEventsPage from "../pages/events/PopularEventsPage";
import NewEventsPage from "../pages/events/NewEventsPage";
import CategoryPage from "../pages/events/CategoryPage";
import EventDetailPage from "../pages/events/EventDetailPage";
import SearchPage from "../pages/events/SearchPage";
import { TouchableOpacity, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BackIcon from "../assets/events/backIcon.svg";
import SeatSelectPage from "../pages/events/SeatSelectPage";
import PaymentScreen from "../pages/events/PaymentScreen";
import FaceAuthScreen from "../pages/tickets/FaceAuthScreen";

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
          headerTitle: () => null,
          headerLeft: () => <CustomHeaderLeftWithTitle title="인기 티켓" />,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="NewEvents"
        component={NewEventsPage}
        options={{
          headerTitle: () => null,
          headerLeft: () => <CustomHeaderLeftWithTitle title="신규 티켓" />,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailPage}
        options={{
          headerTitle: "",
          headerLeft: () => <CustomHeaderLeftWithTitle title="상세 정보" />,
          headerBackVisible: false,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="SeatSelect"
        component={SeatSelectPage}
        options={{
          headerTitle: "",
          headerLeft: () => <CustomHeaderLeftWithTitle title="좌석 선택" />,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          headerTitle: "",
          headerLeft: () => <CustomHeaderLeftWithTitle title="결제하기" />,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="CategoryPage"
        component={CategoryPage}
        options={({ route }: { route: any }) => ({
          headerLeft: () => (
            <CustomHeaderLeftWithTitle
              title={route.params?.categoryName || "카테고리"}
            />
          ),
          headerTitle: "",
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
      <Stack.Screen name="FaceAuthScreen" component={FaceAuthScreen} />
    </Stack.Navigator>
  );
}
