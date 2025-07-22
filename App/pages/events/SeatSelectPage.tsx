import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  ActivityIndicator,
} from "react-native";
import SeatMap from "../../components/events/SeatMap";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getSeatsByZone } from "../../services/EventService";
import { Seat } from "../../services/Types";
import { buyTickets } from "../../services/EventService";

type RootStackParamList = {
  Payment: {
    event: any;
    event_time?: any;
    selected?: string[];
    purchase_id?: number;
    ticketIds?: number[];
    seatInfos?: any[];
  };
  SeatSelect: { event: any; event_time?: any; zone_id?: number };
};

const zoneIds = [1, 2, 3, 4];

export default function SeatSelectPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [availableCount, setAvailableCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { event, event_time } = route.params as {
    event: any;
    event_time?: any;
  };
  const [eventDate, setEventDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllSeats = async () => {
      try {
        setLoading(true);

        // 모든 zone의 좌석 데이터를 병렬로 요청
        const responses = await Promise.all(
          zoneIds.map((id) => getSeatsByZone(id))
        );

        // 유효한 응답만 필터링해서 하나의 배열로 합치기
        const allSeats = responses
          .filter((res) => res.statusCode === 200 && Array.isArray(res.data))
          .flatMap((res) => res.data);

        setSeats(allSeats);

        // 전체 좌석 중 예약 가능 좌석 수 계산 (booked/reserved 제외)
        const totalAvailable = allSeats.filter(
          (seat) =>
            seat.seat_status !== "booked" && seat.seat_status !== "reserved"
        ).length;
        setAvailableCount(totalAvailable);
      } catch (err) {
        setError("전체 좌석을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllSeats();
  }, []);

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

  const handleGoToPayment = async () => {
    try {
      const seatIds = seats
        .filter((seat) => selected.includes(seat.seat_number))
        .map((seat) => seat.seat_id);
      const selectedSeats = seats.filter((seat) =>
        seatIds.includes(seat.seat_id)
      );
      const event_time_id = event_time.event_time_id;
      console.log("event.id:", event.id);
      console.log("event_time_id:", event_time.event_time_id);
      console.log("seatIds:", seatIds);
      // seatInfos 생성: 선택된 좌석의 상세 정보 추출
      const seatInfos = seats.filter((seat) => seatIds.includes(seat.seat_id));
      console.log("buyTickets body:", {
        seat_id: seatIds,
        event_time_id: event_time_id,
      });
      const buyResult = await buyTickets(event.id, {
        seat_id: seatIds,
        event_time_id: event_time_id,
      });
      navigation.navigate("Payment", {
        event,
        event_time,
        selected,
        purchase_id: buyResult.purchase_id,
        ticketIds: buyResult.ticket_ids,
        seatInfos,
      });
    } catch (e) {
      alert("좌석 예매 중 오류가 발생했습니다.");
    }
  };

  // 날짜/시간 포맷 함수
  function formatEventDateTime(dateStr: string, timeStr: string) {
    const date = new Date(dateStr + "T" + timeStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const week = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    const hour = timeStr.slice(0, 2);
    const minute = timeStr.slice(3, 5);
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
          {eventDate && startTime
            ? `${formatEventDateTime(eventDate, startTime)} | ${
                event?.location || ""
              }`
            : event?.location || ""}
        </Text>
      </View>
      <SeatMap
        selected={selected}
        onSelectSeat={handleSelectSeat}
        event_time={event_time}
        seats={seats}
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
          onPress={handleGoToPayment}
        >
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "500" }}>
            결제하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
