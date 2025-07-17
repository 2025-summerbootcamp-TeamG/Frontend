import React from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import Svg, { Rect, Text as SvgText } from "react-native-svg";
import { useRoute } from "@react-navigation/native";

// 색상 정의 (이미지 색상표에 맞게)
const sectionColors = {
  VIP: "#FFB3B3", // 연분홍
  R: "#A7C7F9", // 연하늘
  S: "#B9FBC0", // 연연두
  A: "#D6B4F9", // 연보라
};

// 좌석 간격을 줄이고, 각 구역별로 배열 배치
const seatGap = 20;
const seatWidth = 16;
const startY = 110;
const startX = 40; // VIP 좌석의 시작 X 좌표

// VIP: 5x5 배열, 3구역 (왼쪽, 가운데, 오른쪽) - 더 떨어뜨려 배치
const vipSections = [
  { name: "VIP-L", color: sectionColors.VIP, offsetX: 40 },
  { name: "VIP-C", color: sectionColors.VIP, offsetX: 150 },
  { name: "VIP-R", color: sectionColors.VIP, offsetX: 260 },
];
const totalRows = 4; // 각 구역의 행 수
const totalCols = 5; // 각 구역의 열 수
const totalSeatRows = totalRows * vipSections.length; // 12
const rowNames = Array.from({ length: totalSeatRows }, (_, i) =>
  String.fromCharCode(65 + i)
);

const vipRows = ["A", "B", "C", "D"]; // 4줄
const vipCols = 15; // 각 줄에 15좌석
const groupSize = 5; // 한 덩어리 좌석 수
const groupGap = 10; // 덩어리 사이 간격(px)
const zoneName = "VIP";

const vipSeats: {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
}[] = [];
vipRows.forEach((row, rowIdx) => {
  for (let col = 1; col <= vipCols; col++) {
    const seatName = `${row}${col}`;
    const groupIdx = Math.floor((col - 1) / groupSize);
    const x = startX + (col - 1) * seatGap + groupIdx * groupGap;
    vipSeats.push({
      id: `${zoneName}-${seatName}`,
      name: seatName,
      x,
      y: startY + rowIdx * seatGap,
      color: sectionColors.VIP,
    });
  }
});

// S석: 4x5 배열 (왼쪽, 오른쪽만)
const sSections = [
  { name: "S-L", color: sectionColors.S, offsetX: 40 },
  { name: "S-R", color: sectionColors.S, offsetX: 280 },
];
const sZoneName = "S";
const sRows = ["A", "B", "C", "D", "E"]; // 5줄
const sCols = 8; // 8좌석 (4+4)
const sStartX = 40;
const sStartY = startY + 110;

const sSeats: { id: string; name: string; x: number; y: number }[] = [];
sRows.forEach((row, rowIdx) => {
  for (let col = 1; col <= sCols; col++) {
    const seatName = `${row}${col}`;
    sSeats.push({
      id: `${sZoneName}-${seatName}`,
      name: seatName,
      x: sStartX + (col - 1) * seatGap + (col > 4 ? 160 : 0), // 4좌석씩 띄우기
      y: sStartY + rowIdx * seatGap,
    });
  }
});

const rZoneName = "R";
const rRows = ["A", "B", "C", "D", "E"]; // 5줄
const rCols = 6; // 6좌석
const rStartX = 140;
const rStartY = startY + 120;

const rSeats: { id: string; name: string; x: number; y: number }[] = [];
rRows.forEach((row, rowIdx) => {
  for (let col = 1; col <= rCols; col++) {
    const seatName = `${row}${col}`;
    rSeats.push({
      id: `${rZoneName}-${seatName}`,
      name: seatName,
      x: rStartX + (col - 1) * seatGap,
      y: rStartY + rowIdx * seatGap,
    });
  }
});

// A석: 24x5 배열, 일자 배치
const aZoneName = "A";
const aRows = ["A", "B"]; // 2줄
const aCols = 16; // 16좌석
const aStartX = 40;
const aStartY = startY + 250;

const aSeats: { id: string; name: string; x: number; y: number }[] = [];
aRows.forEach((row, rowIdx) => {
  for (let col = 1; col <= aCols; col++) {
    const seatName = `${row}${col}`;
    aSeats.push({
      id: `${aZoneName}-${seatName}`,
      name: seatName,
      x: aStartX + (col - 1) * seatGap,
      y: aStartY + rowIdx * seatGap,
    });
  }
});

// TODO: API 연동 시 zone별 available_count를 받아오면 아래 getAvailableCount 함수와 seatSections 계산은 제거할 것!

// 1. 구역별 전체 좌석 수 계산
const seatSections = [
  { name: "VIP", color: sectionColors.VIP, seats: vipSeats },
  { name: "S", color: sectionColors.S, seats: sSeats },
  { name: "R", color: sectionColors.R, seats: rSeats },
  { name: "A", color: sectionColors.A, seats: aSeats },
];

// SeatMap 컴포넌트가 선택 좌석(selected)과 setSelected, onSelectSeat 콜백을 props로 받도록 수정
interface SeatMapProps {
  selected: string[];
  onSelectSeat: (id: string) => void;
  event_time: any;
}

export default function SeatMap({
  selected,
  onSelectSeat,
  event_time,
}: SeatMapProps) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const route = useRoute();
  const event =
    route.params && "event" in route.params
      ? (route.params as any).event
      : { artist: "콘서트 제목" };
  const [modalMessage, setModalMessage] = React.useState("");

  // reservedSeats를 함수 내부에서 추출
  const reservedSeats: string[] = [];
  if (event_time && Array.isArray(event_time.zones)) {
    (event_time.zones as any[]).forEach((zone: any) => {
      (zone.seats as any[]).forEach((seat: any) => {
        if (seat.seat_status === "booked") {
          reservedSeats.push(seat.seat_number);
        }
      });
    });
  }

  // getAvailableCount 함수도 내부로 이동
  function getAvailableCount(zone: string) {
    const section = seatSections.find((s) => s.name === zone);
    if (!section) return 0;
    return section.seats.filter((seat) => !reservedSeats.includes(seat.id))
      .length;
  }

  const handleSelect = (id: string) => {
    console.log("좌석 클릭됨", id);
    if (reservedSeats.includes(id)) {
      setModalMessage("이미 선점된 좌석입니다.");
      setModalVisible(true);
      return;
    }
    onSelectSeat(id);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 상단 콘서트 제목 및 공연 일자/장소 제거 */}
      {/* <Text ...>{event.name}</Text> */}
      {/* <Text ...>{event.date} | {event.location}</Text> */}
      {/* SVG 좌석 배치 */}
      <View
        style={{
          alignItems: "center",
          marginBottom: 16,
          width: 400, // svgWidth 제거
          height: 450, // svgHeight 제거
        }}
      >
        <Svg
          width={400} // svgWidth 제거
          height={450} // svgHeight 제거
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {/* Stage 박스 */}
          <Rect
            x={95}
            y={23}
            width={200}
            height={60}
            rx={8}
            fill="#E5E7EB"
            stroke="#888"
            strokeWidth={1}
          />
          {/* Stage 텍스트 */}
          <SvgText
            x={195}
            y={54}
            fontSize={18}
            fontWeight="bold"
            fill="#888"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            STAGE
          </SvgText>
          {seatSections
            .flatMap((section) =>
              section.seats.map((seat) => ({
                ...seat,
                type: section.name,
                color: section.color,
              }))
            )
            .map((seat) => (
              <Rect
                key={seat.id}
                x={seat.x}
                y={seat.y}
                width={seatWidth}
                height={16} // seatHeight 제거
                rx={3}
                fill={
                  selected.includes(seat.id) || reservedSeats.includes(seat.id)
                    ? "#cccccc"
                    : seat.color
                }
                stroke={selected.includes(seat.id) ? "#E53E3E" : "#888"}
                strokeWidth={selected.includes(seat.id) ? 2.5 : 1}
              />
            ))}
        </Svg>
        {/* Overlay TouchableOpacity for each seat */}
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 400, // svgWidth 제거
            height: 450, // svgHeight 제거
          }}
          pointerEvents="box-none"
        >
          {seatSections
            .flatMap((section) =>
              section.seats.map((seat) => ({
                ...seat,
                type: section.name,
                color: section.color,
              }))
            )
            .map((seat) => (
              <TouchableOpacity
                key={seat.id}
                style={{
                  position: "absolute",
                  left: seat.x,
                  top: seat.y,
                  width: seatWidth,
                  height: 16, // seatHeight 제거
                  zIndex: 10,
                }}
                onPress={() => handleSelect(seat.id)}
                activeOpacity={0.5}
              />
            ))}
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        {seatSections.map(({ name, color }) => (
          <View
            key={name}
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginHorizontal: 8,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  backgroundColor: color,
                  marginRight: 4,
                }}
              />
              <Text style={{ fontSize: 12 }}>{name}석</Text>
            </View>
            <Text style={{ color: "#E53E3E", fontSize: 11, marginTop: 2 }}>
              잔여좌석: {getAvailableCount(name)}석
            </Text>
          </View>
        ))}
      </View>
      {/* 이미 선점된 좌석 안내 모달 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
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
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.1,
              shadowRadius: 25,
              elevation: 10,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                backgroundColor: "#DCFCE7",
                borderRadius: 24,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 28, color: "#16A34A" }}>✓</Text>
            </View>
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
              {modalMessage}
            </Text>
            <Pressable
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
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
