import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";

// sentry 에러 테스트 코드
import * as Sentry from "sentry-expo";
import { useEffect } from "react";
import { Text, View } from "react-native";

Sentry.init({
  dsn: "https://xxx.ingest.sentry.io/xxxxxx", // 너 프로젝트 DSN으로 교체
  enableInExpoDevelopment: true,
  debug: true,
});

export default function App() {
  useEffect(() => {
    throw new Error("🚨 Sentry test error 발생!");
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
