import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Cancel from "../../assets/tickets/Cancel.svg";

interface TicketType {
  artist?: string;
  ticket_seat?: string;
  ticket_date?: string;
  date?: string;
}

interface QRCodeModalProps {
  ticket?: TicketType | null;
  onClose: () => void;
}

export default function QRCodeModal({ ticket, onClose }: QRCodeModalProps) {
  const t = ticket || {};
  const [timer, setTimer] = useState<number>(60);
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <View style={styles.overlay}>
      <SafeAreaView style={styles.modalContainer}>
        {/* 상단 헤더 (닫기 버튼 포함) */}
        <View style={styles.headerWrap}>
          <View style={styles.headerContent}>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>티켓 QR코드</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Cancel width={32} height={32} />
            </TouchableOpacity>
          </View>
        </View>
        {/* 본문 */}
        <View style={styles.bodyWrap}>
          {/* QR코드 영역 (실제 QR코드 대신 회색 박스) */}
          <View style={styles.qrBoxWrap}>
            <View style={styles.qrBox}>
              {timer === 0 && (
                <View style={styles.qrExpiredBox}>
                  <Text style={styles.qrExpiredText}>
                    QR코드가 만료되었습니다
                  </Text>
                </View>
              )}
            </View>
          </View>
          {/* 공연명(artist) */}
          <View style={styles.marginWrap1}>
            <View style={styles.eventTitleWrap}>
              <Text style={styles.eventTitle}>{t.artist || ""}</Text>
            </View>
          </View>
          {/* 좌석 정보 */}
          <View style={styles.marginWrap1}>
            <View style={styles.seatWrap}>
              <Text style={styles.seatText}>
                {t.ticket_seat !== "null" ? t.ticket_seat : ""}
              </Text>
            </View>
          </View>
          {/* 날짜 정보 */}
          <View style={styles.marginWrap1}>
            <View style={styles.seatWrap}>
              <Text style={styles.seatText}>
                {t.ticket_date !== "null" ? t.ticket_date : t.date || ""}
              </Text>
            </View>
          </View>
          {/* 안내문구 (빨간색, 가운데 정렬) */}
          <View style={styles.noticeWrap}>
            <Text style={styles.noticeText}>
              입장시 QR코드와 신분증을 함께 제시해 주세요.
            </Text>
          </View>
        </View>
        {/* 하단 빨간 박스(버튼 스타일) - 타이머만 표시, 만료 시 00 유지 */}
        <View style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>
            {timer.toString().padStart(2, "0")}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 320,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    paddingBottom: 0,
  },
  headerWrap: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 17,
    backgroundColor: "#fff",
  },
  headerContent: {
    width: 288,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 32,
  },
  headerTitleWrap: {
    width: 95,
    height: 28,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "700",
    fontFamily: "Roboto-Bold",
    color: "#000",
    textAlign: "left",
  },
  bodyWrap: {
    width: "100%",
    alignItems: "center",
    padding: 24,
  },
  qrBoxWrap: {
    paddingBottom: 16,
    flexDirection: "row",
  },
  qrBox: {
    width: 192,
    height: 192,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  qrExpiredBox: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 192,
    height: 192,
    alignItems: "center",
    justifyContent: "center",
  },
  qrExpiredText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  marginWrap1: {
    paddingBottom: 4,
    flexDirection: "row",
  },
  eventTitleWrap: {
    width: 192,
    height: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    color: "#4b5563",
  },
  seatWrap: {
    width: 192,
    height: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  seatText: {
    color: "#6b7280",
    lineHeight: 16,
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Roboto-Regular",
  },
  noticeWrap: {
    width: 235,
    justifyContent: "center",
    height: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  noticeText: {
    color: "#ef4444",
    textAlign: "center",
    lineHeight: 16,
    fontSize: 12,
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
  },
  saveBtn: {
    width: 131,
    borderRadius: 8,
    backgroundColor: "#e53e3e",
    height: 37,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  saveBtnText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "Roboto-Regular",
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 2,
  },
});
