import React, { useState, useRef, useEffect } from "react";
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
import {
  FaceGuideCheck,
  AWSFaceRecognitionRegister,
  FaceRegister,
} from "../../services/TicketService";
import type {
  GuideLineCheckResponse,
  FaceRegisterResponse,
  SaveFaceToDBResponse,
} from "../../services/Types";
import * as LocalAuthentication from "expo-local-authentication";

// 응답 객체에서 message를 안전하게 추출하는 함수
function extractMessage(res: any): string {
  if (!res) return "";
  if (typeof res.message === "string") return res.message;
  if (res.data && typeof res.data.message === "string") return res.data.message;
  return "";
}

export default function FaceRegisterScreen({ navigation, route }: any) {
  // PaymentScreen에서 받은 파라미터들 모두 추출
  const {
    event,
    event_time,
    selected,
    purchase_id,
    ticketIds = [],
    seatInfos = [],
    ticketId: paramTicketId, // 추가: route.params.ticketId
  } = route?.params || {};

  // ticketId 우선순위: paramTicketId → ticketIds[0] → null
  const ticketId = paramTicketId ?? (ticketIds.length > 0 ? ticketIds[0] : null);
  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 여부
  const [isSuccess, setIsSuccess] = useState(true); // 등록 성공/실패 여부
  const cameraRef = useRef<any>(null); // 카메라 ref
  const [permission, requestPermission] = useCameraPermissions(); // 카메라 권한 상태
  const [loading, setLoading] = useState(false); // 등록 처리 중 여부
  const [error, setError] = useState(""); // 에러 메시지
  const [successMessage, setSuccessMessage] = useState(""); // 성공 메시지
  const [errorMessage, setErrorMessage] = useState(""); // 실패 메시지
  const [biometricPassed, setBiometricPassed] = useState(false); // 생체인증 성공 여부

  useEffect(() => {
    // 기존 로그 출력 유지
    console.log("FaceRegisterScreen params:", route?.params);
    console.log("event:", route?.params?.event);
    console.log("event_time:", route?.params?.event_time);
    console.log("selected:", route?.params?.selected);
    console.log("purchase_id:", route?.params?.purchase_id);
    console.log("ticketIds:", route?.params?.ticketIds);
    console.log("seatInfos:", route?.params?.seatInfos);
    // 안드로이드에서만 생체인증 자동 실행 (기존 코드)
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
    }
    // iOS에서만 진입 시 Face ID 자동 실행
    if (Platform.OS === "ios") {
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
    }
  }, [route?.params]);

  // 카메라 권한이 없을 때 권한 요청 UI 표시
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

  // 얼굴 등록 처리 함수
  const handleRegister = async () => {
    // iOS Face ID 인증 부분 제거 (진입 시 이미 인증됨)
    setLoading(true); // 로딩 시작
    setError("");
    try {
      // 카메라 ref가 없으면 에러 처리
      if (!cameraRef.current) throw new Error("카메라를 찾을 수 없습니다.");
      // 사진 촬영 (base64 인코딩, 화질 0.3)
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
      // 2. AWS 얼굴 등록 (서버에 이미지 전송)
      const awsRes: FaceRegisterResponse = await AWSFaceRecognitionRegister(
        ticketId,
        { image: imageBase64 }
      );
      if (
        !awsRes.success &&
        !(awsRes.message && awsRes.message.includes("성공"))
      ) {
        setIsSuccess(false);
        setSuccessMessage("");
        setErrorMessage(awsRes.message || "AWS 얼굴 등록 실패");
        setModalVisible(true);
        setLoading(false);
        return;
      }
      // 3. DB에 얼굴 등록 결과 저장
      let dbRes: SaveFaceToDBResponse | any, dbStatus: number, message: string;
      try {
        const dbResponse = await FaceRegister(ticketId, {
          face_verified: true,
        });
        dbRes = dbResponse;
        dbStatus = 200;
        message = extractMessage(dbRes);
      } catch (err: any) {
        dbRes = err.response?.data || {};
        dbStatus = err.response?.status || 500;
        message = extractMessage(dbRes);
      }
      const isSuccessMsg: boolean = !!(
        message &&
        (message.includes("성공") || message.includes("정상적으로 업데이트"))
      );
      setIsSuccess(isSuccessMsg);
      setSuccessMessage(isSuccessMsg ? message : "");
      setErrorMessage(!isSuccessMsg ? message : "");
      setModalVisible(true);
      setLoading(false);
      return;
    } catch (e: any) {
      setIsSuccess(false);
      setSuccessMessage("");
      let msg = "등록 중 오류가 발생했습니다.";
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
      setLoading(false);
    }
  };

  // 버튼 클릭 시 생체인증 먼저 진행
  const handleBiometricAndRegister = async () => {
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
      // 생체인증 성공 시 기존 등록 로직 실행
      await handleRegister();
    } catch (e) {
      setError("생체인증 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      {/* 안내 문구 */}
      <Text style={styles.desc1}>
        티켓 리셀 방지를 위한 본인 등록 절차입니다.
      </Text>
      <Text style={styles.desc2}>
        얼굴이 가이드라인 안에 들어오도록 위치시켜 주세요.
      </Text>
      {/* 가이드 박스 및 카메라 */}
      <View style={styles.guideBox}>
        <View style={styles.dottedRect}>
          {/* 카메라 뷰 */}
          <CameraView style={styles.camera} facing="front" ref={cameraRef} />
          {/* 얼굴 가이드라인(타원) */}
          <View style={styles.oval} pointerEvents="none" />
          {/* 가이드 텍스트 */}
          <View style={styles.guideTextBox}>
            <Text style={styles.guideText}>
              카메라를 정면으로 바라봐 주세요.
            </Text>
          </View>
        </View>
      </View>
      {/* 에러 메시지 표시 */}
      {error ? (
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      ) : null}
      {/* 얼굴 등록 버튼 */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "등록 중..." : "얼굴 등록"}
        </Text>
      </TouchableOpacity>
      {/* 결과 모달 (성공/실패) */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {/* 성공/실패 아이콘 */}
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
            {/* 모달 제목 */}
            <Text style={styles.modalTitle}>
              {isSuccess ? "등록 완료" : "등록 실패"}
            </Text>
            {/* 모달 설명(성공/실패 메시지) */}
            <Text style={styles.modalDesc}>
              {isSuccess ? successMessage : errorMessage}
            </Text>
            {/* 확인 버튼: 성공 시 동반자 등록 또는 내 티켓 화면으로 이동 */}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                if (isSuccess) {
                  // 등록이 성공한 경우에만 아래 분기 실행
                  if (seatInfos.length >= 2) {
                    // 좌석 정보가 2개 이상인 경우(동반자 좌석이 있는 경우)
                    // CompanionRegisterScreen(동반자 등록 화면)으로 이동
                    // PaymentScreen에서 받았던 파라미터들을 그대로 넘김
                    navigation.navigate("CompanionRegisterScreen", {
                      event,
                      event_time,
                      selected,
                      purchase_id,
                      ticketIds,
                      seatInfos,
                    });
                  } else {
                    // 좌석이 1개뿐인 경우(동반자 없음)
                    // MyTickets(내 티켓 목록) 화면으로 이동
                    navigation.navigate("MyTickets");
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

// 스타일 정의 (UI 레이아웃 및 색상 등)
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
