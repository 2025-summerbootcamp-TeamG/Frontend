import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { StatusBar } from "react-native";

export default function App() {
  return (
    <>
      <StatusBar hidden={false} />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}
