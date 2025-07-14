import React from "react";
import { SafeAreaView, View, Text } from "react-native";

const MainHeader = () => (
  <SafeAreaView style={{ backgroundColor: "#E53E3E" }}>
    <View
      style={{
        width: "100%",
        height: 52,
        backgroundColor: "#E53E3E",
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 12,
        paddingBottom: 12,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          flex: 1,
          height: 28,
          justifyContent: "flex-start",
          alignItems: "center",
          display: "flex",
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
    </View>
  </SafeAreaView>
);

export default MainHeader;
