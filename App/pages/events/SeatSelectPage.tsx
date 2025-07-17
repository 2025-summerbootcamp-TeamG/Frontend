import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import SeatMap from "../../components/events/SeatMap";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Payment: undefined;
  SeatSelect: { event: any; event_time?: any };
};

export default function SeatSelectPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { event, event_time } = route.params as {
    event: any;
    event_time?: any;
  };

  const handleSelectSeat = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // 날짜/시간 포맷 함수
  function formatEventTime(eventTime: any) {
    if (!eventTime) return "";
    const date = new Date(eventTime.event_date + "T" + eventTime.start_time);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const week = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    const hour = eventTime.start_time.slice(0, 2);
    const minute = eventTime.start_time.slice(3, 5);
    return `${month}월 ${day}일 (${week}) ${hour}:${minute}`;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 콘서트 이름/일정 상단 표시 */}
      <View style={{ alignItems: "center", marginTop: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 4 }}>
          {event?.name || "콘서트 제목"}
        </Text>
        <Text style={{ fontSize: 16, color: "#6B7280" }}>
          {event_time
            ? `${formatEventTime(event_time)} | ${event?.location || ""}`
            : event?.location || ""}
        </Text>
      </View>
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
