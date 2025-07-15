import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import HomeActive from "../assets/common/HomeIcon_active.svg";
import HomeInactive from "../assets/common/HomeIcon_inactive.svg";
import TicketActive from "../assets/common/TicketIcon_active.svg";
import TicketInactive from "../assets/common/TicketIcon_inactive.svg";
import MyActive from "../assets/common/MyIcon_active.svg";
import MyInactive from "../assets/common/MyIcon_inactive.svg";
import HomeStackNavigator from "./HomeStackNavigator";
import MyPage from "../pages/user/MyPage"; 
import CompanionRegisterScreen from '../pages/tickets/CompanionRegisterScreen';
import TicketStackNavigator from "./TicketStackNavigator";
import PaymentScreen from '../pages/events/PaymentScreen';

const TicketScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>티켓 화면</Text>
  </View>
);

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#E53E3E",
        tabBarInactiveTintColor: "#6B7280",
      }}
    >
      <Tab.Screen
        name="홈"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused, size }: { focused: boolean; size: number }) =>
            focused ? (
              <HomeActive width={size} height={size} />
            ) : (
              <HomeInactive width={size} height={size} />
            ),
          tabBarLabel: ({ color }: { color: string }) => (
            <Text style={{ color, fontSize: 12 }}>홈</Text>
          ),
        }}
      />
      <Tab.Screen
        name="내 티켓"
        component={TicketScreen} //얼굴 인증 페이지를 보려면 TicketStackNavigator로 TicketScreen 변경
        options={{
          tabBarIcon: ({ focused, size }: { focused: boolean; size: number }) =>
            focused ? (
              <TicketActive width={size} height={size} />
            ) : (
              <TicketInactive width={size} height={size} />
            ),
          tabBarLabel: ({ color }: { color: string }) => (
            <Text style={{ color, fontSize: 12 }}>티켓</Text>
          ),
        }}
      />
      <Tab.Screen
        name="마이페이지"
        component={MyPage}   
        options={{
          tabBarIcon: ({ focused, size }: { focused: boolean; size: number }) =>
            focused ? (
              <MyActive width={size} height={size} />
            ) : (
              <MyInactive width={size} height={size} />
            ),
          tabBarLabel: ({ color }: { color: string }) => (
            <Text style={{ color, fontSize: 12 }}>마이</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
