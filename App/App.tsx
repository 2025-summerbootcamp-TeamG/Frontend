import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import * as Sentry from "@sentry/react-native";
import { SENTRY_DSN } from "@env";

Sentry.init({
  dsn: SENTRY_DSN,
  debug: true,
  sendDefaultPii: true,
  replaysSessionSampleRate: __DEV__ ? 0 : 0.1,
  replaysOnErrorSampleRate: __DEV__ ? 0 : 1,
  integrations: [Sentry.mobileReplayIntegration()],
  // spotlight: __DEV__, // 필요 시 주석 해제
});

export default function App() {
  useEffect(() => {}, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
