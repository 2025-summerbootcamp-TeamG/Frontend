import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyPage from "../pages/user/MyPage";
import { AuthHistoryModal } from "../pages/user/AuthHistoryModal";
import { CustomHeaderLeftWithTitle } from "./HomeStackNavigator";

const Stack = createNativeStackNavigator();

export default function MyPageStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyPageMain"
        component={MyPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AuthHistoryModal"
        component={AuthHistoryModal}
        options={{
          headerLeft: () => <CustomHeaderLeftWithTitle title="인증 내역" />, 
          headerTitle: ""
        }}
      />
    </Stack.Navigator>
  );
} 