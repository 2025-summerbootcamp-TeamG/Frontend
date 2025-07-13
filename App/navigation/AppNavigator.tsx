import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text } from "react-native";

// 스택 네비게이터 타입 정의
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  // 추가 화면들...
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 임시 홈 화면 컴포넌트
const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>홈 화면</Text>
  </View>
);

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "홈" }}
        />
        {/* 추가 화면들:
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: '로그인' }}
        />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
