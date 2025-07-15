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

// VIP: 5x5 배열, 3구역 (왼쪽, 가운데, 오른쪽) - 더 떨어뜨려 배치
const vipSections = [
  { name: "VIP-L", color: sectionColors.VIP, offsetX: 40 },
  { name: "VIP-C", color: sectionColors.VIP, offsetX: 150 },
  { name: "VIP-R", color: sectionColors.VIP, offsetX: 260 },
];
const vipSeats = vipSections.flatMap((section, sIdx) =>
  Array.from({ length: 4 }, (_, row) =>
    Array.from({ length: 5 }, (_, col) => ({
      id: `${section.name}-${row + 1}-${col + 1}`,
      x: section.offsetX + col * seatGap,
      y: startY + row * seatGap,
    }))
  ).flat()
);

// S석: 4x5 배열 (왼쪽, 오른쪽만)
const sSections = [
  { name: "S-L", color: sectionColors.S, offsetX: 40 },
  { name: "S-R", color: sectionColors.S, offsetX: 280 },
];
const sSeats = sSections.flatMap((section, sIdx) =>
  Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 4 }, (_, col) => ({
      id: `${section.name}-${row + 1}-${col + 1}`,
      x: section.offsetX + col * seatGap,
      y: startY + 110 + row * seatGap,
    }))
  ).flat()
);

// R석: 8x5 배열 (S석 오른쪽 끝과 왼쪽 끝 사이)
const rOffsetX = 140;
const rSeats = Array.from({ length: 5 }, (_, row) =>
  Array.from({ length: 6 }, (_, col) => ({
    id: `R-${row + 1}-${col + 1}`,
    x: rOffsetX + col * seatGap,
    y: startY + 120 + row * seatGap,
  }))
).flat();

// A석: 24x5 배열, 일자 배치
const aOffsetX = 40;
const aCols = 16;
const aRows = 2;
const aSeats = Array.from({ length: aRows }, (_, row) =>
  Array.from({ length: aCols }, (_, col) => ({
    id: `A-${row + 1}-${col + 1}`,
    x: aOffsetX + col * seatGap,
    y: startY + 250 + row * seatGap,
  }))
).flat();

const seatSections = [
  { name: "VIP", color: sectionColors.VIP, seats: vipSeats },
  { name: "S", color: sectionColors.S, seats: sSeats },
  { name: "R", color: sectionColors.R, seats: rSeats },
  { name: "A", color: sectionColors.A, seats: aSeats },
];

// 예시: 이미 선점된 좌석(다른 사람이 선택한 좌석)
const reservedSeats = ["VIP2", "R5", "S8", "A10"];

// seatSections를 seats 배열로 변환
const seats: {
  id: string;
  x: number;
  y: number;
  type: string;
  color: string;
}[] = seatSections.flatMap((section) =>
  section.seats.map((seat) => ({
    ...seat,
    type: section.name,
    color: section.color,
  }))
);

// SeatMap 컴포넌트가 선택 좌석(selected)과 setSelected, onSelectSeat 콜백을 props로 받도록 수정
interface SeatMapProps {
  selected: string[];
  onSelectSeat: (id: string) => void;
}

export default function SeatMap({ selected, onSelectSeat }: SeatMapProps) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const route = useRoute();
  const event =
    route.params && "event" in route.params
      ? (route.params as any).event
      : { artist: "콘서트 제목" };
  const [modalMessage, setModalMessage] = React.useState("");

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
      {/* 상단 콘서트 제목만 표시 */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 20,
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        {event.artist}
      </Text>
      {/* 공연 일자 및 장소 */}
      <Text
        style={{
          fontSize: 16,
          color: "#6B7280",
          textAlign: "center",
          marginTop: 2,
          marginBottom: 12,
        }}
      >
        {event.date} | {event.location}
      </Text>
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
          {seats.map((seat) => (
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
          {seats.map((seat) => (
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
        {Object.entries({ VIP: "VIP석", R: "R석", S: "S석", A: "A석" }).map(
          ([type, label]) => (
            <View
              key={type}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 8,
              }}
            >
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  backgroundColor:
                    sectionColors[type as keyof typeof sectionColors],
                  marginRight: 4,
                }}
              />
              <Text style={{ fontSize: 12 }}>{label}</Text>
            </View>
          )
        )}
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
