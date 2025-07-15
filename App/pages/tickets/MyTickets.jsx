import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import MainHeader from "../../components/common/MainHeader";
// 이미지 import (require 사용) + 지금은 null로 대체
const ticketsData = [
  {
    id: 1,
    image: null,
    title: "BTS 월드투어 2025",
    date: "2025.07.15 (화) 19:00",
    venue: "서울 올림픽 주경기장",
    seat: "VIP석 L열 14",
    status: "verified",
    statusText: "인증완료",
    primaryButton: "QR코드 보기",
    primaryButtonAction: "qr",
  },
  {
    id: 2,
    image: null,
    title: "서울시향 정기공연",
    date: "2025.08.01 (금) 19:30",
    venue: "롯데콘서트홀",
    seat: "R석 A열 5",
    status: "pending",
    statusText: "인증필요",
    primaryButton: "얼굴 인증하기",
    primaryButtonAction: "verify",
  },
  {
    id: 3,
    image: null,
    title: "현대미술전: 빛과 그림자",
    date: "2025.07.30 (수) 10:00",
    venue: "국립현대미술관",
    seat: "일반",
    status: "verified",
    statusText: "인증완료",
    primaryButton: "QR코드 보기",
    primaryButtonAction: "qr",
    isExpired: true,
  },
  {
    id: 4,
    image: null,
    title: "두산 vs LG 프로야구",
    date: "2025.07.25 (금) 18:30",
    venue: "잠실야구장",
    seat: "내야지정석",
    status: "pending",
    statusText: "인증필요",
    primaryButton: "얼굴 인증하기",
    primaryButtonAction: "verify",
  },
  {
    id: 5,
    image: null,
    title: "백조의 호수",
    date: "2025.09.01 (월) 19:00",
    venue: "세종문화회관",
    seat: "S석 G열 8",
    status: "verified",
    statusText: "인증완료",
    primaryButton: "QR코드 보기",
    primaryButtonAction: "qr",
  },
];

const filterOptions = [
  { label: "전체", value: "전체" },
  { label: "예정", value: "예정" },
  { label: "지난", value: "지난" },
];

const TicketCard = ({ ticket, navigation }) => {
  const statusStyle =
    ticket.status === "verified"
      ? [styles.statusBadge, { backgroundColor: "#dcfce7" }]
      : [styles.statusBadge, { backgroundColor: "#fef9c2" }];
  const statusTextColor =
    ticket.status === "verified" ? { color: "#16a34a" } : { color: "#eab308" };

  const handlePrimaryButtonPress = () => {
    if (ticket.primaryButtonAction === "verify") {
      navigation.navigate("FaceAuthScreen");
    }
    // QR 등 다른 액션은 기존대로
  };

  return (
    <View style={styles.card}>
      <View style={styles.marginWrap}>
        {/* 행사 이미지 대신 하얀 빈칸 */}
        <View style={styles.blankImage} />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.h324}>
            <Text style={styles.cardTitle}>{ticket.title}</Text>
          </View>
          <View style={[styles.statusBadge, statusStyle]}>
            <Text style={[styles.statusText, statusTextColor]}>
              {ticket.statusText}
            </Text>
          </View>
        </View>
        <View style={styles.marginWrap1}>
          <View style={styles.p30}>
            <Text style={styles.cardInfo}>{ticket.date}</Text>
          </View>
        </View>
        <View style={styles.p30}>
          <Text style={styles.cardInfo}>{ticket.venue}</Text>
        </View>
        <View style={styles.marginWrap1}>
          <View style={styles.p30}>
            <Text style={styles.cardInfo}>{ticket.seat}</Text>
          </View>
        </View>
        <View style={styles.marginWrap3}>
          <View style={styles.div39}>
            <TouchableOpacity style={styles.showqrcode140} onPress={handlePrimaryButtonPress}>
              <Text style={styles.qr42}>{ticket.primaryButton}</Text>
            </TouchableOpacity>
            <View style={styles.marginWrap4}>
              <TouchableOpacity style={styles.showdetails143}>
                <Text style={styles.text3}>상세정보</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function MyTickets({ navigation }) {
  const [activeFilter, setActiveFilter] = useState("전체");

  // 필터링 로직(예시, 실제로는 날짜/상태에 따라 분기)
  const filteredTickets = ticketsData; // 실제 필터링 필요시 구현

  return (
    <>
      <MainHeader />
      <ScrollView
        style={{ backgroundColor: "#fff", flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 80,
          alignItems: "center",
          paddingTop: 0,
        }}
      >
        <View style={{ width: "100%", padding: 16, backgroundColor: "#fff" }}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>내 티켓</Text>
            <View style={styles.filterRow}>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterButton,
                    activeFilter === option.value && styles.filterButtonActive,
                  ]}
                  onPress={() => setActiveFilter(option.value)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      activeFilter === option.value &&
                        styles.filterButtonTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        {/* 티켓 리스트 */}
        {filteredTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} navigation={navigation} />
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  customHeader: {
    width: "100%",
    height: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ef4444",
    justifyContent: "center",
  },
  customHeaderText: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: "Pacifico-Regular",
    color: "#fff",
    textAlign: "left",
  },
  container: { flex: 1, backgroundColor: "#f9fafb" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 16,
    width: 343,
    alignSelf: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  filterRow: { flexDirection: "row" },
  filterButton: {
    backgroundColor: "#f2f4f5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
  },
  filterButtonActive: { backgroundColor: "#e43d3d" },
  filterButtonText: { color: "#4a5462", fontSize: 15, fontWeight: "500" },
  filterButtonTextActive: { color: "#fff" },
  listContainer: { paddingBottom: 32, alignItems: "center" },
  card: {
    width: 343,
    height: 136,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    paddingTop: 12,
    paddingBottom: 13,
    paddingLeft: 12,
    paddingRight: 12,
  },
  marginWrap: {
    paddingRight: 12,
    flexDirection: "row",
  },
  blankImage: {
    width: 80,
    height: 96,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginTop: 0,
    marginBottom: 0,
    overflow: "hidden",
  },
  cardContent: {
    width: 225,
    height: 109,
    justifyContent: "flex-start",
    paddingTop: 0,
    paddingLeft: 0,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 21,
    width: 225,
    marginBottom: 0,
  },
  h324: {
    width: 117,
    height: 21,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    fontFamily: "Roboto-Bold",
    color: "#000",
    textAlign: "left",
  },
  statusBadge: {
    width: 60,
    borderRadius: 9999,
    backgroundColor: "#dcfce7",
    height: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontFamily: "Roboto-Regular",
    lineHeight: 16,
    fontSize: 12,
    textAlign: "left",
  },
  marginWrap1: {
    paddingTop: 4,
    flexDirection: "row",
  },
  p30: {
    height: 16,
    width: 225,
    flexDirection: "row",
    alignItems: "center",
  },
  cardInfo: {
    color: "#4b5563",
    fontFamily: "Roboto-Regular",
    lineHeight: 16,
    fontSize: 12,
    textAlign: "left",
  },
  marginWrap3: {
    paddingTop: 8,
    flexDirection: "row",
  },
  div39: {
    height: 24,
    width: 225,
    flexDirection: "row",
  },
  showqrcode140: {
    width: 87,
    backgroundColor: "#e53e3e",
    borderRadius: 8,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  qr42: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    lineHeight: 16,
    fontSize: 12,
  },
  marginWrap4: {
    paddingLeft: 8,
    flexDirection: "row",
  },
  showdetails143: {
    width: 68,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  text3: {
    color: "#4b5563",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    lineHeight: 16,
    fontSize: 12,
  },
});
