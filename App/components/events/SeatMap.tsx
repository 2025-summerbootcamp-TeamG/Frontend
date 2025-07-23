import React from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import Svg, { Rect, Text as SvgText } from "react-native-svg";
import { useRoute } from "@react-navigation/native";
import { Seat } from "../../services/Types";

type VisualSeat = {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
};

const sectionColors: { [key: string]: string } = {
  VIP: "#FFB3B3",
  R: "#A7C7F9",
  S: "#B9FBC0",
  A: "#D6B4F9",
};

const seatGap = 20;
const seatWidth = 16;
const startY = 110;
const startX = 40;

const vipRows = ["A", "B", "C", "D"];
const vipCols = 15;
const groupSize = 5;
const groupGap = 10;
const zoneName = "VIP";

const vipSeats: VisualSeat[] = [];
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

const sRows = ["A", "B", "C", "D", "E"];
const sCols = 8;
const sStartX = 40;
const sStartY = startY + 110;

const sSeats: VisualSeat[] = [];
sRows.forEach((row, rowIdx) => {
  for (let col = 1; col <= sCols; col++) {
    const seatName = `${row}${col}`;
    sSeats.push({
      id: `S-${seatName}`,
      name: seatName,
      x: sStartX + (col - 1) * seatGap + (col > 4 ? 160 : 0),
      y: sStartY + rowIdx * seatGap,
      color: sectionColors.S,
    });
  }
});

const rRows = ["A", "B", "C", "D", "E"];
const rCols = 6;
const rStartX = 140;
const rStartY = startY + 120;

const rSeats: VisualSeat[] = [];
rRows.forEach((row, rowIdx) => {
  for (let col = 1; col <= rCols; col++) {
    const seatName = `${row}${col}`;
    rSeats.push({
      id: `R-${seatName}`,
      name: seatName,
      x: rStartX + (col - 1) * seatGap,
      y: rStartY + rowIdx * seatGap,
      color: sectionColors.R,
    });
  }
});

const aRows = ["A", "B"];
const aCols = 16;
const aStartX = 40;
const aStartY = startY + 250;

const aSeats: VisualSeat[] = [];
aRows.forEach((row, rowIdx) => {
  for (let col = 1; col <= aCols; col++) {
    const seatName = `${row}${col}`;
    aSeats.push({
      id: `A-${seatName}`,
      name: seatName,
      x: aStartX + (col - 1) * seatGap,
      y: aStartY + rowIdx * seatGap,
      color: sectionColors.A,
    });
  }
});

const seatSections = [
  { name: "VIP", color: sectionColors.VIP, seats: vipSeats },
  { name: "S", color: sectionColors.S, seats: sSeats },
  { name: "R", color: sectionColors.R, seats: rSeats },
  { name: "A", color: sectionColors.A, seats: aSeats },
];

interface SeatMapProps {
  selected: string[];
  onSelectSeat: (id: string) => void;
  event_time: any;
  seats: Seat[];
}

export default function SeatMap({
  selected,
  onSelectSeat,
  event_time,
  seats,
}: SeatMapProps) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState("");
  const route = useRoute();
  const event =
    route.params && "event" in route.params
      ? (route.params as any).event
      : { artist: "콘서트 제목" };

  const apiSeatsMap = React.useMemo(
    () => new Map(seats.map((s) => [s.seat_number, s])),
    [seats]
  );

  // 🆕 zone별 available_count 계산 (첫 seat 기준)
  const zoneAvailableMap = React.useMemo(() => {
    const map = new Map<string, number>();
    const zoneSet = new Set<string>();

    for (const seat of seats) {
      const zonePrefix = seat.seat_number.split("-")[0];
      if (!zoneSet.has(zonePrefix) && seat.available_count !== undefined) {
        map.set(zonePrefix, seat.available_count);
        zoneSet.add(zonePrefix);
      }
    }
    return map;
  }, [seats]);

  function getAvailableCount(zoneName: string): number {
    return zoneAvailableMap.get(zoneName) ?? 0;
  }

  const handleSelect = (seat: { id: string; name: string }) => {
    const apiSeatData = apiSeatsMap.get(seat.id);

    if (
      apiSeatData?.seat_status === "booked" ||
      apiSeatData?.seat_status === "reserved"
    ) {
      setModalMessage("이미 선점된 좌석입니다.");
      setModalVisible(true);
      return;
    }
    onSelectSeat(seat.id);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          alignItems: "center",
          marginBottom: 16,
          width: 400,
          height: 450,
        }}
      >
        <Svg
          width={400}
          height={450}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
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
          {seatSections.flatMap((section) =>
            section.seats.map((seat) => {
              const apiSeatData = apiSeatsMap.get(seat.id);
              const isReserved =
                apiSeatData?.seat_status === "booked" ||
                apiSeatData?.seat_status === "reserved";
              const isSelected = selected.includes(seat.id);
              return (
                <Rect
                  key={seat.id}
                  x={seat.x}
                  y={seat.y}
                  width={seatWidth}
                  height={16}
                  rx={3}
                  fill={
                    isSelected || isReserved
                      ? "#cccccc"
                      : sectionColors[section.name]
                  }
                  stroke={isSelected ? "#E53E3E" : "#888"}
                  strokeWidth={isSelected ? 2.5 : 1}
                />
              );
            })
          )}
        </Svg>
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 400,
            height: 450,
          }}
          pointerEvents="box-none"
        >
          {seatSections.flatMap((section) =>
            section.seats.map((seat) => (
              <TouchableOpacity
                key={seat.id}
                style={{
                  position: "absolute",
                  left: seat.x,
                  top: seat.y,
                  width: seatWidth,
                  height: 16,
                  zIndex: 10,
                }}
                onPress={() => handleSelect(seat)}
                activeOpacity={0.5}
              />
            ))
          )}
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
            style={{ alignItems: "center", marginHorizontal: 8 }}
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
