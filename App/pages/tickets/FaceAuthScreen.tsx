// Frontend/App/pages/user/FaceAuthScreen.tsx
import React, { useState, useRef } from "react";
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
import axios from "axios";
import { FaceGuideCheck, FaceAuth } from '../../services/TicketService';
import type { GuideLineCheckResponse, FaceAuthResponse } from '../../services/Types';

export default function FaceAuthScreen({ navigation, route }: any) {
  const ticketId = route?.params?.ticketId;
  const [modalVisible, setModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  // 사진 촬영 및 얼굴 인증 처리 함수
  const handleAuth = async () => {
    setLoading(true); // 로딩 시작
    setError("");
    setSuccessMessage('');
    setErrorMessage('');
    try {
      // 카메라 ref가 없으면 에러 처리
      if (!cameraRef.current) throw new Error("카메라를 찾을 수 없습니다.");
      // 사진 촬영 (base64 인코딩, 화질 0.3, 고용량 사진은 처리를 못함)
      // @ts-ignore
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.3 });
      const imageBase64 = photo.base64;
      // 1. 얼굴이 가이드라인 안에 있는지 체크 (서버에 이미지 전송)
      const guideRes: GuideLineCheckResponse = await FaceGuideCheck({ image: imageBase64 }); // 얼굴 가이드라인 체크 API 호출, 결과는 { is_in_guide, message } 형태로 반환됨(성공 시 is_in_guide: true/false, message: 안내문구)
      if (!guideRes.is_in_guide) {
        // 가이드라인 벗어남: 실패 모달 표시
        setIsSuccess(false);
        setSuccessMessage('');
        setErrorMessage(guideRes.message || '얼굴을 가이드라인에 맞춰주세요');
        setModalVisible(true);
        setLoading(false);
        return;
      }
      // 2. 얼굴 인증 요청 (서버에 이미지 전송)
      // FaceAuth API는 AWS Rekognition에서 user_{user_id}_ticket_{ticket_id}로 등록된 얼굴과만 비교하여 인증합니다.
      // 응답 예시:
      //  - 성공: { message: "얼굴 인증 성공", FaceId, ExternalImageId, Similarity }
      //  - 실패(유사도 낮음): { message: "얼굴이 일치하지 않습니다. (등록된 얼굴이지만 다른 사람)", Similarity, ExternalImageId }
      //  - 등록된 얼굴 없음: { message: "등록된 얼굴이 없습니다. (등록된 FaceId 없음)", Similarity: 0 }
      //  - 다른 사람의 얼굴: { message: "해당 티켓에 등록되지 않은 사용자입니다.", Similarity }
      //  - 입력값 오류: { message: "image가 필요합니다." }
      //  - 서버 오류: { message: "AWS Rekognition 처리 중 오류", error }
      const authRes: FaceAuthResponse = await FaceAuth(ticketId, { image: imageBase64 });
      // 인증 결과 처리
      if (authRes.message && authRes.message.includes('성공')) {
        // 성공 케이스 (메시지에 '성공'이 포함된 경우만)
        setIsSuccess(true);
        setSuccessMessage(authRes.message || '얼굴 인증이 성공적으로 완료되었습니다.');
        setErrorMessage('');
      } else {
        // 실패 케이스 (유사도 부족, 등록된 얼굴 없음, 다른 사람의 얼굴 등)
        setIsSuccess(false);
        setSuccessMessage('');
        setErrorMessage(authRes.message || '인증에 실패했습니다.');
      }
      setModalVisible(true);
      setLoading(false);
      return;
    } catch (e: any) {
      // 예외 발생 시 실패 처리
      setIsSuccess(false);
      setSuccessMessage('');
      let msg = "인증 중 오류가 발생했습니다.";
      if (e.response && e.response.data) {
        msg = e.response.data.message || e.response.data.error || JSON.stringify(e.response.data);
      } else if (e.message) {
        msg = e.message;
      }
      setErrorMessage(msg);
      setModalVisible(true);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.desc1}>본인 확인을 위한 얼굴 인증 절차입니다.</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "인증 중..." : "얼굴 인증"}</Text>
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
            <Text style={styles.modalTitle}>{isSuccess ? "인증 성공" : "인증 실패"}</Text>
            <Text style={styles.modalDesc}>
              {isSuccess ? successMessage : errorMessage}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                if (isSuccess) navigation.goBack();
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
