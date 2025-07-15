import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FaceAuthScreen from "../pages/tickets/FaceAuthScreen";
import CompanionRegisterScreen from "../pages/tickets/CompanionRegisterScreen";
import PaymentScreen from "../pages/events/PaymentScreen";
// 새로 추가
import MyTickets from "../pages/tickets/MyTickets";
import EventDetailPage from "../pages/events/EventDetailPage";

const Stack = createNativeStackNavigator();

export default function TicketStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 새로 추가 */}
      <Stack.Screen name="MyTickets" component={MyTickets} />
      <Stack.Screen name="TicketDetail" component={EventDetailPage} />

      {/* 기존 화면 */}
      <Stack.Screen name="FaceAuthScreen" component={FaceAuthScreen} />
      <Stack.Screen
        name="CompanionRegisterScreen"
        component={CompanionRegisterScreen}
      />
      <Stack.Screen name="결제하기" component={PaymentScreen} />
    </Stack.Navigator>
  );
}
