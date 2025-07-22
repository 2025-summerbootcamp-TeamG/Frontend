import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { FaceGuideCheck, AWSFaceRecognitionRegister, FaceRegister } from '../../services/TicketService';
import type { GuideLineCheckResponse, FaceRegisterResponse, SaveFaceToDBResponse } from '../../services/Types';

// 응답에서 message 안전하게 추출
function extractMessage(res: any): string {
  if (!res) return '';
  if (typeof res.message === 'string') return res.message;
  if (res.data && typeof res.data.message === 'string') return res.data.message;
  return '';
}

export default function FaceRegisterScreen({ navigation, route }: any) {
  const ticketId = route?.params?.ticketId;
  const [modalVisible, setModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const selectedSeats = route?.params?.selected_seats || [];
  const seatInfos = route?.params?.seatInfos || [];

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View>
        <Text>카메라 접근 권한이 필요합니다.</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>권한 요청</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 사진 촬영 및 등록
  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      if (!cameraRef.current) throw new Error("카메라를 찾을 수 없습니다.");
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.3 });
      const imageBase64 = photo.base64;

      // 1. 가이드라인 체크
      const guideRes: GuideLineCheckResponse = await FaceGuideCheck({ image: imageBase64 });
      if (!guideRes.is_in_guide) {
        setIsSuccess(false);
        setSuccessMessage('');
        setErrorMessage(guideRes.message || '얼굴을 가이드라인에 맞춰주세요');
        setModalVisible(true);
        setLoading(false);
        return;
      }

      // 2. AWS 얼굴 등록
      const awsRes: FaceRegisterResponse = await AWSFaceRecognitionRegister(ticketId, { image: imageBase64 });
      if (!awsRes.success && !(awsRes.message && awsRes.message.includes("성공"))) {
        setIsSuccess(false);
        setSuccessMessage('');
        setErrorMessage(awsRes.message || 'AWS 얼굴 등록 실패');
        setModalVisible(true);
        setLoading(false);
        return;
      }

      // 3. DB 저장
      let dbRes: SaveFaceToDBResponse | any, dbStatus: number, message: string;
      try {
        const dbResponse = await FaceRegister(ticketId, { face_verified: true });
        dbRes = dbResponse.data ? dbResponse.data : dbResponse;
        dbStatus = dbResponse.status || 200;
        message = extractMessage(dbRes);
      } catch (err: any) {
        dbRes = err.response?.data || {};
        dbStatus = err.response?.status || 500;
        message = extractMessage(dbRes);
      }

      // 성공/실패 분기 (메시지에 '성공' 또는 '정상적으로 업데이트' 포함 시 무조건 성공)
      const isSuccessMsg: boolean = !!(
        message &&
        (
          message.includes("성공") ||
          message.includes("정상적으로 업데이트")
        )
      );
      setIsSuccess(isSuccessMsg);
      setSuccessMessage(isSuccessMsg ? message : '');
      setErrorMessage(!isSuccessMsg ? message : '');
      setModalVisible(true);
      setLoading(false);
      return;
    } catch (e: any) {
      setIsSuccess(false);
      setSuccessMessage('');
      let msg = "등록 중 오류가 발생했습니다.";
      if (e.response && e.response.data) {
        msg = e.response.data.message || e.response.data.error || JSON.stringify(e.response.data);
      } else if (e.message) {
        msg = e.message;
      }
      setErrorMessage(msg);
      setModalVisible(true);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.desc1}>티켓 리셀 방지를 위한 본인 등록 절차입니다.</Text>
      <Text style={styles.desc2}>얼굴이 가이드라인 안에 들어오도록 위치시켜 주세요.</Text>
      <View style={styles.guideBox}>
        <View style={styles.dottedRect}>
          <CameraView style={styles.camera} facing="front" ref={cameraRef} />
          <View style={styles.oval} pointerEvents="none" />
          <View style={styles.guideTextBox}>
            <Text style={styles.guideText}>카메라를 정면으로 바라봐 주세요.</Text>
          </View>
        </View>
      </View>
      {error ? <Text style={{ color: "red", textAlign: "center" }}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "등록 중..." : "얼굴 등록"}</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View
              style={[
                styles.modalIconCircle,
                { backgroundColor: isSuccess ? "#D1FADF" : "#FEE2E2" },
              ]}
            >
              {isSuccess ? (
                <Ionicons name="checkmark" size={40} color="#22C55E" />
              ) : (
                <Ionicons name="close" size={40} color="#EF4444" />
              )}
            </View>
            <Text style={styles.modalTitle}>
              {isSuccess ? "등록 완료" : "등록 실패"}
            </Text>
            <Text style={styles.modalDesc}>
              {isSuccess ? successMessage : errorMessage}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                if (isSuccess) {
                  if (seatInfos.length >= 2) {
                    navigation.navigate('CompanionRegisterScreen', { ticketId, seatInfos });
                  } else {
                    navigation.navigate('MyTickets');
                  }
                }
              }}
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
  desc1: {
    color: "#4B5563",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    marginHorizontal: 24,
    fontWeight: "400",
  },
  desc2: {
    color: "#4B5563",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    marginHorizontal: 24,
    fontWeight: "400",
  },
  guideBox: { alignItems: "center", marginBottom: 16 },
  dottedRect: {
    width: 343,
    height: 300,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E53E3E",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  camera: {
    width: 343,
    height: 300,
    position: "absolute",
    top: 0,
    left: 0,
  },
  oval: {
    position: "absolute",
    top: 40,
    left: 81.5,
    width: 180,
    height: 220,
    borderWidth: 2,
    borderColor: "#E53E3E",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    backgroundColor: "transparent",
  },
  guideTextBox: {
    position: "absolute",
    left: 86.75,
    top: 224,
    width: 170,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    paddingHorizontal: 8,
  },
  guideText: {
    color: "#222",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#E53E3E",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 24,
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
    backgroundColor: "#D1FADF", // 이 값은 동적으로 바뀜
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