import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FaceAuthScreen from "../pages/tickets/FaceAuthScreen";
import CompanionRegisterScreen from "../pages/tickets/CompanionRegisterScreen";
import PaymentScreen from "../pages/events/PaymentScreen";
// 새로 추가
import MyTickets from "../pages/tickets/MyTickets";
import EventDetailPage from "../pages/events/EventDetailPage";
import { CustomHeaderLeftWithTitle } from './HomeStackNavigator'; // 경로 맞게

const Stack = createNativeStackNavigator();

export default function TicketStackNavigator() {
  return (
    <Stack.Navigator>
      {/* 새로 추가 */}
      <Stack.Screen name="MyTickets" component={MyTickets} options={{ headerShown: false }} />
      <Stack.Screen name="TicketDetail" component={EventDetailPage} />

      {/* 기존 화면 */}
      <Stack.Screen
        name="FaceAuthScreen"
        component={FaceAuthScreen}
        options={{
          headerTitle: "",
          headerLeft: () => <CustomHeaderLeftWithTitle title="얼굴 인증" />,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="CompanionRegisterScreen"
        component={CompanionRegisterScreen}
        options={{
          headerTitle: "",
          headerLeft: () => <CustomHeaderLeftWithTitle title="동행자 등록" />,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen name="결제하기" component={PaymentScreen} />
    </Stack.Navigator>
  );
}
