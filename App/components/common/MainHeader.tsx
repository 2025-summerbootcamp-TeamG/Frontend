import React from "react";
import { View, Text, Platform, StatusBar, SafeAreaView } from "react-native";

const MainHeader = () => {
  return (
    <View
      style={{
        backgroundColor: "#E53E3E",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <SafeAreaView>
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
            TeamG가 최고
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default MainHeader;
