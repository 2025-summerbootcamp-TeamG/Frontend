import React, { useState } from "react";
import { View, TouchableOpacity, Text, Modal } from "react-native";
import SeatMap from "../../components/events/SeatMap";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Payment: { event: any; event_time?: any; selected?: string[] };
  SeatSelect: { event: any; event_time?: any };
};

export default function SeatSelectPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { event, event_time } = route.params as {
    event: any;
    event_time?: any;
  };

  const handleSelectSeat = (id: string) => {
    if (
      !selected.includes(id) &&
      event.max_reserve &&
      selected.length >= event.max_reserve
    ) {
      setModalVisible(true);
      return;
    }
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleRequireLogin = () => {
    setLoginModalVisible(true);
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
      <SeatMap
        selected={selected}
        onSelectSeat={handleSelectSeat}
        event_time={event_time}
      />
      {/* 초과 안내 모달 */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 240,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 8 }}>
              안내
            </Text>
            <Text
              style={{
                color: "#4B5563",
                fontSize: 13,
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              1인 최대 예매 가능 수({event.max_reserve}매)를 초과할 수 없습니다.
            </Text>
            <TouchableOpacity
              style={{
                width: 120,
                height: 32,
                backgroundColor: "#E53E3E",
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "white", fontSize: 13, fontWeight: "400" }}>
                확인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* 로그인 필요 안내 모달 */}
      <Modal visible={loginModalVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 240,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 8 }}>
              안내
            </Text>
            <Text
              style={{
                color: "#4B5563",
                fontSize: 13,
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              로그인이 필요합니다.
            </Text>
            <TouchableOpacity
              style={{
                width: 120,
                height: 32,
                backgroundColor: "#3182CE",
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setLoginModalVisible(false)}
            >
              <Text style={{ color: "white", fontSize: 13, fontWeight: "400" }}>
                확인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
          onPress={() =>
            navigation.navigate("Payment", { event, event_time, selected })
          }
        >
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "500" }}>
            결제하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
