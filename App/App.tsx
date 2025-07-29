import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import { useFonts } from "expo-font";

const SENTRY_DSN = Constants.expoConfig?.extra?.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  debug: true,
  sendDefaultPii: true,
  replaysSessionSampleRate: __DEV__ ? 0 : 0.1,
  replaysOnErrorSampleRate: __DEV__ ? 0 : 1,
  integrations: [Sentry.mobileReplayIntegration()],
});

export default function App() {
  const [fontsLoaded] = useFonts({
    SacheonUniverse: require("./assets/fonts/SancheonUjuOTF-Regular.otf"),
  });

  if (!fontsLoaded) {
    return null; // 폰트 로딩 중엔 화면 렌더링 안 함
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
