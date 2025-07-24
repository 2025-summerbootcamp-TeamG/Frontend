// Frontend/App/pages/user/FaceAuthScreen.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import axios from "axios";
import { FaceGuideCheck, FaceAuth, certifyTicket } from '../../services/TicketService';
import type {
  GuideLineCheckResponse,
  FaceAuthResponse,
} from "../../services/Types";
import * as LocalAuthentication from "expo-local-authentication";

export default function FaceAuthScreen({ navigation, route }: any) {
  const ticketId = route?.params?.ticketId;
  const [modalVisible, setModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [biometricPassed, setBiometricPassed] = useState(false); // 생체인증 성공 여부
  const [isAuthenticated, setIsAuthenticated] = useState(Platform.OS !== 'ios');

  React.useEffect(() => {
    if (Platform.OS === "android") {
      const runBiometric = async () => {
        setError("");
        setLoading(true);
        try {
          const hasHardware = await LocalAuthentication.hasHardwareAsync();
          const isEnrolled = await LocalAuthentication.isEnrolledAsync();
          if (!hasHardware || !isEnrolled) {
            setError("생체인증이 지원되지 않거나 등록되어 있지 않습니다.");
            setLoading(false);
            return;
          }
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "생체인증을 진행해 주세요.",
          });
          if (!result.success) {
            setError("생체인증에 실패했습니다.");
            setLoading(false);
            return;
          }
          setBiometricPassed(true);
          setLoading(false);
        } catch (e) {
          setError("생체인증 중 오류가 발생했습니다.");
          setLoading(false);
        }
      };
      runBiometric();
      return;
    } else if (Platform.OS === "ios") {
      const runFaceId = async () => {
        setError("");
        setLoading(true);
        try {
          const hasHardware = await LocalAuthentication.hasHardwareAsync();
          const isEnrolled = await LocalAuthentication.isEnrolledAsync();
          if (!hasHardware || !isEnrolled) {
            setError("Face ID가 지원되지 않거나 등록되어 있지 않습니다.");
            setLoading(false);
            return;
          }
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Face ID로 인증해 주세요",
            fallbackLabel: "비밀번호 입력",
          });
          if (!result.success) {
            setError("Face ID 인증에 실패했습니다.");
            setLoading(false);
            return;
          }
          setBiometricPassed(true);
          setLoading(false);
        } catch (e) {
          setError("Face ID 인증 중 오류가 발생했습니다.");
          setLoading(false);
        }
      };
      runFaceId();
      return;
    } else {
      setBiometricPassed(true);
    }
  }, [route?.params]);

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

  if (!biometricPassed) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 40, color: "gray" }}>
          본인 확인을 위해 생체인증이 필요합니다.
        </Text>
        {error ? (
          <Text style={{ color: "red", textAlign: "center", marginTop: 16 }}>
            {error}
          </Text>
        ) : null}
      </SafeAreaView>
    );
  }

  // 사진 촬영 및 얼굴 인증 처리 함수
  const handleAuth = async () => {
    // iOS Face ID 인증 부분 제거 (진입 시 이미 인증됨)
    setLoading(true); // 로딩 시작
    setError("");
    setSuccessMessage("");
    setErrorMessage("");
    try {
      // 카메라 ref가 없으면 에러 처리
      if (!cameraRef.current) throw new Error("카메라를 찾을 수 없습니다.");
      // 사진 촬영 (base64 인코딩, 화질 0.3, 고용량 사진은 처리를 못함)
      // @ts-ignore
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.3,
      });
      const imageBase64 = photo.base64;
      // 1. 얼굴이 가이드라인 안에 있는지 체크 (서버에 이미지 전송)
      const guideRes: GuideLineCheckResponse = await FaceGuideCheck({
        image: imageBase64,
      });
      if (!guideRes.is_in_guide) {
        setIsSuccess(false);
        setSuccessMessage("");
        setErrorMessage(guideRes.message || "얼굴을 가이드라인에 맞춰주세요");
        setModalVisible(true);
        setLoading(false);
        return;
      }
      // 2. 얼굴 인증 요청 (서버에 이미지 전송)
      const authRes: FaceAuthResponse = await FaceAuth(ticketId, {
        image: imageBase64,
      });
      // 인증 결과 처리
      if (authRes.message && authRes.message.includes("성공")) {
        setIsSuccess(true);
        setSuccessMessage(
          authRes.message || "얼굴 인증이 성공적으로 완료되었습니다."
        );
        setErrorMessage("");
      } else {
        setIsSuccess(false);
        setSuccessMessage("");
        setErrorMessage(authRes.message || "인증에 실패했습니다.");
      }
      setModalVisible(true);
      setLoading(false);
      return;
    } catch (e: any) {
      setIsSuccess(false);
      setSuccessMessage("");
      let msg = "인증 중 오류가 발생했습니다.";
      if (e.response && e.response.data) {
        msg =
          e.response.data.message ||
          e.response.data.error ||
          JSON.stringify(e.response.data);
      } else if (e.message) {
        msg = e.message;
      }
      setErrorMessage(msg);
      setModalVisible(true);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 생체 인증 및 인증 준비 함수
  const handleBiometric = async () => {
    setError("");
    setLoading(true);
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        setError("생체인증이 지원되지 않거나 등록되어 있지 않습니다.");
        setLoading(false);
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "생체인증을 진행해 주세요.",
      });
      if (!result.success) {
        setError("생체인증에 실패했습니다.");
        setLoading(false);
        return;
      }
      setIsAuthenticated(true); // 성공 시 카메라 보여주기
      setLoading(false);
    } catch (e) {
      setError("생체인증 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isAuthenticated ? (
        <>
          <Text style={styles.desc1}>본인 확인을 위해 생체인증이 필요합니다.</Text>
          {error ? <Text style={{ color: "red", textAlign: "center" }}>{error}</Text> : null}
          <TouchableOpacity
            style={styles.button}
            onPress={handleBiometric}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "인증 중..." : "생체 인증"}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.desc1}>본인 확인을 위한 얼굴 인증 절차입니다.</Text>
          <Text style={styles.desc2}>
            얼굴이 가이드라인 안에 들어오도록 위치시켜 주세요.
          </Text>
          <View style={styles.guideBox}>
            <View style={styles.dottedRect}>
              <CameraView style={styles.camera} facing="front" ref={cameraRef} />
              <View style={styles.oval} pointerEvents="none" />
              <View style={styles.guideTextBox}>
                <Text style={styles.guideText}>
                  카메라를 정면으로 바라봐 주세요.
                </Text>
              </View>
            </View>
          </View>
          {error ? (
            <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.button}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "인증 중..." : "얼굴 인증"}
            </Text>
          </TouchableOpacity>
        </>
      )}
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
              {isSuccess ? "인증 성공" : "인증 실패"}
            </Text>
            <Text style={styles.modalDesc}>
              {isSuccess ? successMessage : errorMessage}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={async () => {
                setModalVisible(false);
                if (isSuccess) {
                  if (route.params?.onAuthSuccess) {
                    route.params.onAuthSuccess(ticketId);
                  }
                  navigation.goBack();
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
