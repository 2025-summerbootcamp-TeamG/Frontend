import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import Cancel from "../../assets/tickets/Cancel.svg";
import TicketCancel from "./TicketCancelModal";
import type { TicketType } from "./MyTickets";
import { cancelTicket } from "../../services/TicketService";

interface TicketInfoProps {
  visible: boolean;
  ticket: TicketType | null;
  onClose: () => void;
  navigation: any; // 추가
  onCancelSuccess?: (ticketId: number) => void;
  isTicketActive?: boolean;
}

export default function TicketInfoModal({
  visible,
  ticket,
  onClose,
  navigation, // 추가
  onCancelSuccess,
  isTicketActive = true,
}: TicketInfoProps) {
  const [cancelModalVisible, setCancelModalVisible] = React.useState(false);
  if (!ticket) return null;
  // 공연 정보 (nested 구조에서 안전하게 추출)
  const event = (ticket as any).seat?.zone?.event_time?.event;
  const seat = (ticket as any).seat;
  const zone = (ticket as any).seat?.zone;
  const performanceInfo = {
    title: event?.name || ticket.name || "NULL",
    artist: event?.artist || "NULL",
    date:
      zone?.event_time?.event_date ||
      ticket.ticket_date ||
      ticket.date ||
      "NULL",
    venue: event?.location || ticket.location || "NULL",
    image_url: event?.image_url || ticket.image_url || undefined,
  };
  // 티켓 정보
  const ticketInfo = [
    {
      label: "좌석 등급",
      value: zone?.rank || ticket.seat_grade || "NULL",
    },
    {
      label: "좌석 번호",
      value: seat?.seat_number || ticket.seat_number || "NULL",
    },
    { label: "예매 번호", value: ticket.reservationNo || ticket.id || "NULL" },
  ];
  // 결제 정보
  const paymentInfo = [
    {
      label: "티켓 금액",
      value: zone?.price
        ? `₩${zone.price.toLocaleString()}`
        : ticket.price
        ? `₩${ticket.price.toLocaleString()}`
        : "NULL",
      color: styles.textBlack,
    },
    {
      label: "예매 수수료",
      value: (ticket as any).fee
        ? `₩${(ticket as any).fee.toLocaleString()}`
        : "₩1,000",
      color: styles.textBlack,
    },
    {
      label: "총 결제 금액",
      value: zone?.price
        ? `₩${(zone.price + 1000).toLocaleString()}`
        : ticket.price
        ? `₩${(ticket.price + 1000).toLocaleString()}`
        : "NULL",
      color: styles.textRed,
    },
    { label: "결제 수단", value: "무통장입금", color: styles.textBlack },
  ];
  // 인증 정보
  const authInfo = [
    {
      label: "인증 상태",
      value: ticket.ticket_statusText || ticket.ticket_status || "NULL",
      isStatus: true,
      statusColor:
        (ticket.ticket_statusText || ticket.ticket_status) === "인증완료"
          ? styles.statusGreen
          : styles.statusYellow,
      statusBg:
        (ticket.ticket_statusText || ticket.ticket_status) === "인증완료"
          ? styles.statusBgGreen
          : styles.statusBgYellow,
    },
    {
      label: "인증 일시",
      value: (ticket as any).verified_at || "NULL",
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* 헤더 */}
          <View style={styles.headerWrap}>
            <View style={styles.headerContent}>
              <View style={styles.headerTitleWrap}>
                <Text style={styles.headerTitle}>티켓 상세정보</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Cancel width={32} height={32} />
              </TouchableOpacity>
            </View>
          </View>
          {/* 본문 */}
          <View style={styles.bodyWrap}>
            {/* 공연 정보 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>공연 정보</Text>
              <Text style={styles.performanceTitle}>
                {performanceInfo.title}
              </Text>
              <Text style={styles.performanceInfo}>{performanceInfo.date}</Text>
              <Text style={styles.performanceInfo}>
                {performanceInfo.venue}
              </Text>
            </View>
            {/* 티켓 정보 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>티켓 정보</Text>
              {ticketInfo.map((item, idx) => (
                <View style={styles.infoRow} key={idx}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              ))}
            </View>
            {/* 결제 정보 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>결제 정보</Text>
              {paymentInfo.map((item, idx) => (
                <View style={styles.infoRow} key={idx}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={[styles.infoValue, item.color]}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
            {/* 인증 정보 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>인증 정보</Text>
              {authInfo.map((item, idx) => (
                <View style={styles.infoRow} key={idx}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  {item.isStatus ? (
                    <View style={[styles.statusBadge, item.statusBg]}>
                      <Text style={[styles.statusText, item.statusColor]}>
                        {item.value}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.infoValue}>{item.value}</Text>
                  )}
                </View>
              ))}
            </View>
            {/* 하단 버튼 영역 */}
            <View style={styles.actionRow}>
              <View style={{ flex: 1, paddingHorizontal: 24 }}>
                <TouchableOpacity
                  activeOpacity={isTicketActive ? 0.8 : 1}
                  style={[
                    styles.cancelticket270,
                    !isTicketActive && { opacity: 0.4 },
                  ]}
                  onPress={() => isTicketActive && setCancelModalVisible(true)}
                  disabled={!isTicketActive}
                >
                  <Text style={styles.cancelText}>예매 취소</Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: 20 }} />
              <View style={{ flex: 1, paddingHorizontal: 24 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.contactsupport273}
                  onPress={() => {
                    /* 고객센터 문의 로직 */
                  }}
                >
                  <Text style={styles.contactText}>고객센터 문의</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      <TicketCancel
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={async () => {
          if (ticket && ticket.id) {
            try {
              await cancelTicket(ticket.id);
              if (onCancelSuccess) onCancelSuccess(ticket.id);
            } catch (e) {
              Alert.alert("요청 실패", "티켓 취소에 실패했습니다.");
            }
          }
        }}
      />
    </Modal>
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
    backgroundColor: "#fff", // 본문 영역 흰색 배경
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
    width: 120,
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
    paddingBottom: 0, // 버튼 영역과 딱 붙게
    backgroundColor: "#fff", // 본문 영역 흰색 배경
  },
  section: {
    width: "100%",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4a5462",
    marginBottom: 4,
  },
  performanceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  performanceInfo: {
    fontSize: 12,
    color: "#4a5462",
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: "#222",
    width: 80,
  },
  infoValue: {
    fontSize: 12,
    color: "#222",
    textAlign: "right",
    flex: 1,
    fontWeight: "bold",
  },
  textBlack: {
    color: "#000",
  },
  textRed: {
    color: "#e43d3d",
  },
  statusBadge: {
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 48,
    backgroundColor: "#fef9c2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  statusGreen: {
    color: "#16a34a",
  },
  statusYellow: {
    color: "#eab308",
  },
  statusBgGreen: {
    backgroundColor: "#dcfce7",
  },
  statusBgYellow: {
    backgroundColor: "#fef9c2",
  },
  actionRow: {
    width: 320, // 모달 전체 너비와 동일하게
    height: 71,
    justifyContent: "space-between",
    paddingHorizontal: 0,
    paddingVertical: 10,
    flexDirection: "row",
    backgroundColor: "#f9fafb", // 하단 버튼 영역만 회색
    alignItems: "center",
    borderBottomLeftRadius: 20, // 모달 하단부 둥글게
    borderBottomRightRadius: 20, // 모달 하단부 둥글게
  },
  cancelticket270: {
    width: 89,
    borderRadius: 8,
    borderStyle: "solid",
    borderColor: "#d1d5db",
    borderWidth: 1,
    height: 39,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 17,
    paddingVertical: 9,
    backgroundColor: "#fff",
  },
  cancelText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "Roboto-Regular",
    color: "#4b5563",
    textAlign: "center",
  },
  contactsupport273: {
    width: 113,
    backgroundColor: "#e53e3e",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "Roboto-Regular",
    color: "#fff",
    textAlign: "center",
  },
  textTypo: {
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    lineHeight: 21,
    fontSize: 14,
  },
  text: {
    color: "#4b5563",
  },
  text1: {
    color: "#fff",
  },
});
