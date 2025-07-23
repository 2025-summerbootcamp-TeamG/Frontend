import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { getMyTickets } from "../../services/UserService"; // 또는 TicketService
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthHistoryModal = ({ navigation }: any) => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        setShowLoginModal(true);
        setLoading(false);
        return;
      }
      try {
        const data = await getMyTickets();
        setTickets(data); // data가 { results: [...] } 형태면 data.results
      } catch (e) {
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#ef4444" style={{ marginTop: 40 }} />;
  }

  if (showLoginModal) {
    return (
      <Modal visible transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: 240, padding: 20, backgroundColor: "white", borderRadius: 16, alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 8 }}>안내</Text>
            <Text style={{ color: "#4B5563", fontSize: 13, textAlign: "center", marginBottom: 12 }}>
              로그인이 필요한 서비스입니다. 로그인부터 해주세요.
            </Text>
            <TouchableOpacity
              style={{ width: 120, height: 32, backgroundColor: "#E53E3E", borderRadius: 8, justifyContent: "center", alignItems: "center" }}
              onPress={() => {
                setShowLoginModal(false);
                navigation.goBack();
              }}
            >
              <Text style={{ color: "white", fontSize: 13, fontWeight: "400" }}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={{ flex: 1, padding: 16 }} contentContainerStyle={{ paddingBottom: 32 }}>
        {tickets.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#888", marginTop: 40 }}>예매한 티켓이 없습니다.</Text>
        ) : (
          tickets.map((ticket, idx) => (
            <View key={ticket.id || idx} style={styles.card}>
              <Text style={styles.cardTitle}>{ticket.event_name}</Text>
              <Text style={styles.cardDesc}>{ticket.event_date} {ticket.event_start_time} {ticket.event_location}</Text>
              <Text style={styles.cardDesc}>좌석: {ticket.seat_rank} {ticket.seat_number}</Text>
              <Text style={styles.cardDesc}>상태: {ticket.ticket_status}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    padding: 17,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 2,
  },
});
