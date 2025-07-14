import React from "react";
import { View } from "react-native";
import { AppNavigator } from "./navigation/AppNavigator";
import MainHeader from "./components/common/MainHeader";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <MainHeader />
      <View style={{ flex: 1 }}>
        <AppNavigator />
      </View>
    </View>
  );
}
