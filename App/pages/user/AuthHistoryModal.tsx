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

// 인증 내역 데이터 예시
const authHistoryData = [
  {
    title: "BTS 월드투어 2025",
    status: "인증완료",
    statusColor: "#16a34a",
    statusBg: "#dcfce7",
    date: "2025.07.01 14:23 인증",
    result: "얼굴 인증 성공",
  },
  {
    title: "현대미술전: 빛과 그림자",
    status: "인증완료",
    statusColor: "#16a34a",
    statusBg: "#dcfce7",
    date: "2025.07.10 09:15 인증",
    result: "얼굴 인증 성공",
  },
  {
    title: "백조의 호수",
    status: "인증완료",
    statusColor: "#16a34a",
    statusBg: "#dcfce7",
    date: "2025.08.15 17:30 인증",
    result: "얼굴 인증 성공 (동행자 1명 포함)",
  },
  {
    title: "서울시향 정기공연",
    status: "인증필요",
    statusColor: "#eab308",
    statusBg: "#fef9c2",
    date: "2025.08.01 공연 예정",
    result: "얼굴 인증 대기 중",
  },
  {
    title: "두산 vs LG 프로야구",
    status: "인증필요",
    statusColor: "#eab308",
    statusBg: "#fef9c2",
    date: "2025.07.25 경기 예정",
    result: "얼굴 인증 대기 중 (동행자 2명)",
  },
];

// onClose props를 받아서 뒤로가기 버튼에서 호출
export const AuthHistoryModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff" /*, width: 375, height: 812 */,
      }}
    >
      <View
        style={{ flex: 1, padding: 16, maxWidth: 400, alignSelf: "center" }}
      >
        {/* 헤더: 상단에 뒤로가기 버튼과 타이틀 */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: 32,
            width: 343,
            marginBottom: 16,
          }}
        >
          {/* 뒤로가기 버튼: 누르면 모달 닫기 */}
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            {/* Back_active.svg 아이콘을 사용한 뒤로가기 버튼 */}
            <BackActiveIcon width={24} height={24} />
          </TouchableOpacity>
          {/* 타이틀 텍스트 */}
          <Text style={{ fontWeight: "bold", fontSize: 18, marginLeft: 8 }}>
            인증 내역
          </Text>
        </View>
        {/* 인증 내역 리스트: 데이터 배열을 map으로 렌더링 */}
        <ScrollView
          style={{ flex: 1 }}
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
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
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
