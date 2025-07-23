import "dotenv/config";

export default {
  expo: {
    name: "App",
    slug: "App",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription: "얼굴 인증을 위해 카메라 접근이 필요합니다.",
        NSFaceIDUsageDescription:
          "이 앱은 본인 확인을 위해 Face ID를 사용합니다.",
      },
    },
    android: {
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
    extra: {
      API_BASE_URL: process.env.API_BASE_URL,
    },
  },
};
