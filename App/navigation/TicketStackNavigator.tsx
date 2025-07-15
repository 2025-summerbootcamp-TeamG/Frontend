import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FaceAuthScreen from "../pages/tickets/FaceAuthScreen";
import CompanionRegisterScreen from "../pages/tickets/CompanionRegisterScreen";
import PaymentScreen from '../pages/payment/PaymentScreen';

const Stack = createNativeStackNavigator();

export default function TicketStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FaceAuthScreen" component={FaceAuthScreen} />
      <Stack.Screen name="CompanionRegisterScreen" component={CompanionRegisterScreen} />
      <Stack.Screen name="결제하기" component={PaymentScreen} />
    </Stack.Navigator>
  );
}
