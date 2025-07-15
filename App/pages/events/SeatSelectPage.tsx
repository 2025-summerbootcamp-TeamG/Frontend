import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import SeatMap from "../../components/events/SeatMap";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Payment: undefined;
};

export default function SeatSelectPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSelectSeat = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SeatMap selected={selected} onSelectSeat={handleSelectSeat} />
      {/* 결제하기 버튼 */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#fff",
          padding: 16,
        }}
      >
        <TouchableOpacity
          style={{
            width: "100%",
            height: 40,
            backgroundColor: "#E53E3E",
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
          disabled={selected.length === 0}
          onPress={() => navigation.navigate("Payment")}
        >
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "500" }}>
            결제하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
