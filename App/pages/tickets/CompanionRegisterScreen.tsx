import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CompanionRegisterScreen({ route, navigation }: any) {
  const companionCount = route.params?.companionCount ?? 1;
  const [companions, setCompanions] = useState(Array(companionCount).fill(""));
  const maxCompanions = 3;
  // 모달 상태 추가
  const [modalVisible, setModalVisible] = useState(false);

  function handleAddCompanion() {
    if (companions.length < maxCompanions) {
      setCompanions([...companions, ""]);
    }
  }

  function handleChangeText(text: string, idx: number) {
    const arr = [...companions];
    arr[idx] = text;
    setCompanions(arr);
  }

  // 등록 완료 버튼 클릭 시 모달 표시
  function handleRegisterComplete() {
    setModalVisible(true);
  }

  // 모달 확인 버튼 클릭 시 MyTickets로 이동
  function handleModalConfirm() {
    setModalVisible(false);
    navigation.navigate('MyTickets');
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* 중앙 아이콘 */}
      <View style={styles.iconCircle}>
        <Ionicons name="person-outline" size={40} color="#E53E3E" />
      </View>

      {/* 안내 텍스트 */}
      <Text style={styles.title}>
        동행자의 앱 <Text style={{ fontWeight: "bold" }}>ID</Text>를
        등록해주세요
      </Text>
      <Text style={styles.desc}>
        등록된 동행자는 별도의 얼굴 등록이 필요합니다
      </Text>

      {/* 동행자 입력 카드 */}
      <ScrollView style={{ flexGrow: 0, marginTop: 24 }}>
        {companions.map((email, idx) => (
          <View key={idx} style={styles.companionInputCard}>
            <View style={styles.companionInputHeader}>
              <Text style={styles.companionInputLabel}>동행자 {idx + 1}</Text>
            </View>
            <TextInput
              style={styles.companionInput}
              placeholder="동행자의 앱 이메일을 입력하세요"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={(text) => handleChangeText(text, idx)}
            />
          </View>
        ))}
      </ScrollView>

      {/* 안내 박스 */}
      <View style={styles.companionInfoBox}>
        <Ionicons
          name="alert-circle-outline"
          size={18}
          color="#EAB308"
          style={{ marginRight: 6 }}
        />
        <View>
          <Text style={styles.companionInfoTitle}>동행자 등록 안내</Text>
          <Text style={styles.companionInfoDesc}>
            동행자는 최대 3명까지 등록 가능하며, 모든 동행자는 24시간 이내에
            얼굴 등록을 완료해야 합니다.
          </Text>
        </View>
      </View>

      {/* 등록 완료 버튼 */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegisterComplete}
      >
        <Text style={styles.buttonText}>등록 완료</Text>
      </TouchableOpacity>
      {/* 등록 완료 모달 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={[styles.modalIconCircle, { backgroundColor: "#D1FADF" }]}> 
              <Ionicons name="checkmark" size={40} color="#22C55E" />
            </View>
            <Text style={styles.modalTitle}>등록 완료</Text>
            <Text style={styles.modalDesc}>동행자 등록이 완료되었습니다.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleModalConfirm}
            >
              <Text style={styles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    flex: 1,
    marginLeft: -28, // 아이콘과 타이틀이 정확히 중앙에 오도록 조정
  },
  iconCircle: {
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 12,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "400",
    color: "#222",
    textAlign: "center",
    marginTop: 4,
  },
  desc: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 0,
  },
  companionInputCard: {
    backgroundColor: "#F7F8FA",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  companionInputHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  companionInputLabel: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 15,
  },
  companionInputAddBtn: {
    marginLeft: "auto",
    padding: 4,
  },
  companionInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: "#F7F8FA",
    padding: 12,
    fontSize: 14,
    color: "#222",
    marginTop: 4,
  },
  companionInfoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEFCE8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  companionInfoTitle: {
    color: "#A16207",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 2,
  },
  companionInfoDesc: {
    color: "#CA8A04",
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    backgroundColor: "#E53E3E",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "500", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: 320,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#D1FADF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 24,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#E53E3E",
    borderRadius: 8,
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
});
