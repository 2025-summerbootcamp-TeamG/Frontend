import "dotenv/config";

export default {
  expo: {
    name: "App",
    slug: "App",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    jsEngine: "jsc",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    extra: {
      API_BASE_URL: process.env.API_BASE_URL,
      SENTRY_DSN: process.env.SENTRY_DSN,
      eas: {
        projectId: "076e8d6c-efe7-4e38-ab4f-7d8721539085",
      },
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ticketaka.ticketing",
      infoPlist: {
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true, // 모든 도메인 허용 (개발용)
        },
        NSCameraUsageDescription: "얼굴 인증을 위해 카메라 접근이 필요합니다.",
        NSFaceIDUsageDescription:
          "이 앱은 본인 확인을 위해 Face ID를 사용합니다.",
      },
    },
    android: {
      package: "com.eunseokyoon.App", // ★ 추가!
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    fonts: [
      {
        asset: "./assets/fonts/Roboto-VariableFont_wdth,wght.ttf",
        family: "Roboto",
      },
    ],
  },
};
