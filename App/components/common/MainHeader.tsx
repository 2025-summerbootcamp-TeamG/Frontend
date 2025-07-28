import React from "react";
import { View, Text, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MainHeader = () => {
  if (Platform.OS === "android") {
    return (
      <View
        style={{
          backgroundColor: "#E53E3E",
          paddingTop: StatusBar.currentHeight,
        }}
      >
        <View
          style={{
            width: "100%",
            height: 52,
            backgroundColor: "#E53E3E",
            paddingLeft: 16,
            paddingRight: 16,
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontFamily: "Pacifico",
              fontWeight: "400",
              lineHeight: 28,
            }}
          >
            Ticketaka
          </Text>
        </View>
      </View>
    );
  } else {
    // iOS: safe-area-context의 SafeAreaView 사용
    return (
      <SafeAreaView style={{ backgroundColor: "#E53E3E" }} edges={["top"]}>
        <View
          style={{
            width: "100%",
            height: 52,
            backgroundColor: "#E53E3E",
            paddingLeft: 16,
            paddingRight: 16,
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 25,
              fontFamily: "SacheonUniverse",
              fontWeight: "400",
              lineHeight: 28,
            }}
          >
            Ticketaka
          </Text>
        </View>
      </SafeAreaView>
    );
  }
};

export default MainHeader;
