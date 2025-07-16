import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import MainHeader from "../../components/common/MainHeader";
import QRCodeModal from "./QRCodeModal";
import TicketInfoModal from "./TicketInfoModal";
import { events } from "../../assets/events/EventsMock";

// 티켓 카드 컴포넌트 (각 티켓 정보를 카드 형태로 렌더링)
interface TicketCardProps {
  ticket: TicketType & { [key: string]: any };
  navigation?: any;
  onQrPress: (ticket: TicketType) => void;
  onDetailPress: (ticket: TicketType) => void;
}

const TicketCard = ({
  ticket,
  navigation,
  onQrPress,
  onDetailPress,
}: TicketCardProps) => {
  const handlePrimaryButtonPress = (ticket: TicketType) => {
    if (ticket.primaryButtonAction === "qr") {
      onQrPress(ticket);
    } else if (ticket.primaryButtonAction === "verify" && navigation) {
      navigation.navigate("FaceAuthScreen", { fromMyTickets: true });
    }
  };

  const statusStyle =
    ticket.ticket_statusText === "인증완료"
      ? [styles.statusBadge, { backgroundColor: "#dcfce7" }]
      : [styles.statusBadge, { backgroundColor: "#fef9c2" }];
  const statusTextColor =
    ticket.ticket_statusText === "인증완료"
      ? { color: "#16a34a" }
      : { color: "#eab308" };

  return (
    <View style={styles.card}>
      <View style={styles.marginWrap}>
        <View style={styles.blankImage} />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.h324}>
            <Text style={styles.cardTitle}>{ticket.artist}</Text>
          </View>
          <View style={[styles.statusBadge, statusStyle]}>
            <Text style={[styles.statusText, statusTextColor]}>
              {ticket.ticket_statusText !== "null"
                ? ticket.ticket_statusText
                : ""}
            </Text>
          </View>
        </View>
        <View style={styles.marginWrap1}>
          <View style={styles.p30}>
            <Text style={styles.cardInfo}>
              {ticket.ticket_date !== "null" ? ticket.ticket_date : ticket.date}
            </Text>
          </View>
        </View>
        <View style={styles.p30}>
          <Text style={styles.cardInfo}>{ticket.location}</Text>
        </View>
        <View style={styles.marginWrap1}>
          <View style={styles.p30}>
            <Text style={styles.cardInfo}>
              {ticket.ticket_seat !== "null" ? ticket.ticket_seat : ""}
            </Text>
          </View>
        </View>
        <View style={styles.marginWrap3}>
          <View style={styles.div39}>
            <TouchableOpacity
              style={styles.showqrcode140}
              onPress={() => handlePrimaryButtonPress(ticket)}
            >
              <Text style={styles.qr42}>
                {ticket.primaryButton !== "null" ? ticket.primaryButton : ""}
              </Text>
            </TouchableOpacity>

            <View style={styles.marginWrap4}>
              <TouchableOpacity
                style={styles.showdetails143}
                onPress={() => onDetailPress(ticket)}
              >
                <Text style={styles.text3}>상세정보</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

interface MyTicketsProps {
  navigation?: any;
}

const filterOptions = [
  { label: "전체", value: "전체" },
  { label: "예정", value: "예정" },
  { label: "지난", value: "지난" },
];

// TicketType에 실제 사용하는 필드 추가
export interface TicketType {
  id?: number;
  artist?: string;
  date?: string;
  location?: string;
  price?: number;
  status?: string;
  image_url?: string;
  type?: string;
  title?: string;
  ticket_date?: string;
  ticket_seat?: string;
  ticket_status?: string;
  ticket_statusText?: string;
  primaryButton?: string;
  primaryButtonAction?: string;
  isExpired?: boolean;
  seat_grade?: string;
  seat_number?: string;
}

export default function MyTickets({ navigation }: MyTicketsProps) {
  const [activeFilter, setActiveFilter] = useState<string>("전체");
  const [qrModalVisible, setQrModalVisible] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);
  const [infoTicket, setInfoTicket] = useState<TicketType | null>(null);

  // 티켓 정보가 없는(필드가 'null'인) 데이터는 리스트에서 제외
  const filteredTickets = events.filter(
    (ticket: any) =>
      ticket.ticket_status !== "null" &&
      ticket.ticket_seat !== "null" &&
      ticket.primaryButton !== "null"
  );

  const handleQrPress = (ticket: TicketType) => {
    setSelectedTicket(ticket);
    setQrModalVisible(true);
  };

  const handleDetailPress = (ticket: TicketType) => {
    setInfoTicket(ticket);
    setInfoModalVisible(true);
  };

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
        {filteredTickets.map((ticket: any) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onQrPress={handleQrPress}
            onDetailPress={handleDetailPress}
            navigation={navigation}
          />
        ))}
      </ScrollView>
      <Modal
        visible={qrModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setQrModalVisible(false)}
      >
        <QRCodeModal
          ticket={selectedTicket}
          onClose={() => setQrModalVisible(false)}
        />
      </Modal>
      <TicketInfoModal
        visible={infoModalVisible}
        ticket={infoTicket}
        onClose={() => setInfoModalVisible(false)}
      />
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
