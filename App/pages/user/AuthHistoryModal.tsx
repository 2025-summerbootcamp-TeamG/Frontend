import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import BackActiveIcon from "../../assets/user/Back_active.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyPage from "../pages/user/MyPage";
import { CustomHeaderLeftWithTitle } from "./HomeStackNavigator";
import { events } from "../../assets/events/EventsMock";

// 인증 내역 카드 컴포넌트 (DIV140 스타일 기반, props로 데이터 받음)
interface AuthHistoryCardProps {
  title: string;
  status: string;
  statusColor: string;
  statusBg: string;
  date: string;
  result: string;
}
const AuthHistoryCard = ({
  title,
  status,
  statusColor,
  statusBg,
  date,
  result,
}: AuthHistoryCardProps) => (
  //<SafeAreaView style={styles.cardWrap}>
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardTitleWrap}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={[styles.cardStatus, { backgroundColor: statusBg }]}>
        <Text style={[styles.cardStatusText, { color: statusColor }]}>
          {status}
        </Text>
      </View>
    </View>
    <View style={styles.cardDateWrap}>
      <Text style={styles.cardDate}>{date}</Text>
    </View>
    <View style={styles.cardResultWrap}>
      <Text style={styles.cardResult}>{result}</Text>
    </View>
  </View>
  //</SafeAreaView>
);

// 인증 내역 데이터 (이벤트 목에서 자동 생성)
const authHistoryData = events
  .filter(
    (ticket) =>
      ticket.ticket_status === "verified" || ticket.ticket_status === "pending"
  )
  .map((ticket) => {
    // 상태 색상 및 배경
    let statusColor = "#eab308";
    let statusBg = "#fef9c2";
    if (ticket.ticket_statusText === "인증완료") {
      statusColor = "#16a34a";
      statusBg = "#dcfce7";
    }
    // 날짜 문구 분기
    function getEventLabel(ticket) {
      if (ticket.genre === "스포츠") return "경기 예정";
      if (ticket.genre === "전시회") return "전시 예정";
      return "공연 예정";
    }
    // 날짜
    let date = "";
    if (ticket.authDate && ticket.authDate !== "") {
      date = ticket.authDate + " 인증";
    } else if (
      Array.isArray(ticket.event_times) &&
      ticket.event_times.length > 0
    ) {
      date = ticket.event_times[0].event_date + " " + getEventLabel(ticket);
    } else if (ticket.date) {
      date = ticket.date + " " + getEventLabel(ticket);
    }
    // 결과
    let result = "";
    if (ticket.ticket_status === "verified") {
      result = "얼굴 인증 성공";
    } else if (ticket.ticket_status === "pending") {
      result = "얼굴 인증 대기 중";
    }
    return {
      title: ticket.name,
      status: ticket.ticket_statusText,
      statusColor,
      statusBg,
      date,
      result,
    };
  });

export const AuthHistoryModal = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ flex: 1, padding: 16, maxWidth: 400, alignSelf: "center" }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="always"
      >
        {authHistoryData.map((item, idx) => (
          <AuthHistoryCard
            key={idx}
            title={item.title}
            status={item.status}
            statusColor={item.statusColor}
            statusBg={item.statusBg}
            date={item.date}
            result={item.result}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  /*cardWrap: {
    backgroundColor: "#fff",
    flex: 1,
  },*/
  card: {
    width: "100%",
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 1,
    borderRadius: 16,
    borderStyle: "solid",
    borderColor: "#f3f4f6",
    borderWidth: 1,
    height: 98,
    padding: 17,
    marginBottom: 16,
  },
  cardHeader: {
    justifyContent: "space-between",
    height: 20,
    width: 309,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitleWrap: {
    width: 116,
    height: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    fontFamily: "Roboto-Medium",
    color: "#000",
    textAlign: "left",
  },
  cardStatus: {
    width: 60,
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cardStatusText: {
    fontFamily: "Roboto-Regular",
    lineHeight: 16,
    fontSize: 12,
    textAlign: "left",
  },
  cardDateWrap: {
    paddingBottom: 4,
    flexDirection: "row",
  },
  cardDate: {
    color: "#4b5563",
    fontFamily: "Roboto-Regular",
    lineHeight: 16,
    fontSize: 12,
    textAlign: "left",
  },
  cardResultWrap: {
    flexDirection: "row",
  },
  cardResult: {
    color: "#6b7280",
    fontFamily: "Roboto-Regular",
    lineHeight: 16,
    fontSize: 12,
    textAlign: "left",
  },
});
