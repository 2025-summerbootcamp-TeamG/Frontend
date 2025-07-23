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
import { FaceGuideCheck, AWSFaceRecognitionRegister, FaceRegister } from '../../services/TicketService';
import type { GuideLineCheckResponse, FaceRegisterResponse, SaveFaceToDBResponse } from '../../services/Types';
import * as LocalAuthentication from 'expo-local-authentication';

// 응답 객체에서 message를 안전하게 추출하는 함수
function extractMessage(res: any): string {
  if (!res) return '';
  if (typeof res.message === 'string') return res.message;
  if (res.data && typeof res.data.message === 'string') return res.data.message;
  return '';
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
  const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지
  const [errorMessage, setErrorMessage] = useState(''); // 실패 메시지
  const [biometricPassed, setBiometricPassed] = useState(false); // 생체인증 성공 여부

  useEffect(() => {
    const runBiometric = async () => {
      try {
        const result = await LocalAuthentication.authenticateAsync({ promptMessage: '생체인증을 진행해 주세요.' });
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
    // iOS에서만 Face ID 인증
    if (Platform.OS === 'ios') {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !enrolled) {
        alert('Face ID가 설정되어 있지 않습니다.');
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Face ID로 인증해 주세요',
        fallbackLabel: '비밀번호 입력',
      });
      if (!result.success) return;
    }
    setLoading(true); // 로딩 시작
    setError("");
    try {
      // 카메라 ref가 없으면 에러 처리
      if (!cameraRef.current) throw new Error("카메라를 찾을 수 없습니다.");
      // 사진 촬영 (base64 인코딩, 화질 0.3)
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

      // 2. AWS 얼굴 등록 (서버에 이미지 전송)
      // AWSFaceRecognitionRegister API는 AWS Rekognition에 user_{user_id}_ticket_{ticket_id}로 얼굴을 등록
      // 응답 예시:
      //  - 성공: { message: "얼굴 등록 성공", FaceId, ExternalImageId }
      //  - 중복: { message: "이미 등록된 얼굴이 있습니다. 중복 등록이 불가합니다.", ExternalImageId }
      //  - 실패: { message: "얼굴 등록 실패", response }
      //  - 입력값 오류: { message: "image가 필요합니다." }
      //  - 서버 오류: { message: "AWS Rekognition 처리 중 오류", error }
      const awsRes: FaceRegisterResponse = await AWSFaceRecognitionRegister(ticketId, { image: imageBase64 });
      // 등록 결과 처리
      if (!awsRes.success && !(awsRes.message && awsRes.message.includes("성공"))) {
        // 등록 실패: 중복, 입력값 오류, AWS 오류 등
        setIsSuccess(false);
        setSuccessMessage('');
        setErrorMessage(awsRes.message || 'AWS 얼굴 등록 실패');
        setModalVisible(true);
        setLoading(false);
        return;
      }

      // 3. DB에 얼굴 등록 결과 저장
      // FaceRegister API는 DB의 ticket 테이블에 face_verified, verified_at만 저장
      // 응답 예시:
      //  - 성공: { code: 200, message: "얼굴 등록 상태가 정상적으로 업데이트 되었습니다", data: {...} }
      //  - 입력값 오류: { message: "face_verified가 필요합니다", data: null }
      //  - 권한 없음: { message: "해당 사용자의 티켓 권한 없음", data: null }
      //  - 티켓 없음: { message: "티켓 없음", data: null }
      //  - 서버 오류: { message: "내부 서버 오류", error }
      let dbRes: SaveFaceToDBResponse | any, dbStatus: number, message: string;
      try {
        // DB 저장 API 호출
        const dbResponse = await FaceRegister(ticketId, { face_verified: true }); // 서버에 얼굴 등록 상태를 저장하는 API 호출
        dbRes = dbResponse; // 바로 결과 객체 사용 (예: { message, data })
        dbStatus = 200; // 응답에 별도 status/code가 없으므로 200으로 고정
        message = extractMessage(dbRes); // 응답 객체에서 message 문자열만 안전하게 추출
      } catch (err: any) {
        // 에러 발생 시 에러 응답에서 메시지 추출
        dbRes = err.response?.data || {};
        dbStatus = err.response?.status || 500;
        message = extractMessage(dbRes);
      }
      // 성공/실패 분기 (메시지에 '성공' 또는 '정상적으로 업데이트' 포함 시 성공 처리)
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
      // 예외 발생 시 실패 처리
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
      const result = await LocalAuthentication.authenticateAsync({ promptMessage: '생체인증을 진행해 주세요.' });
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
        <Text style={{textAlign:'center', marginTop:40, color:'gray'}}>본인 확인을 위해 생체인증이 필요합니다.</Text>
        {error ? <Text style={{ color: "red", textAlign: "center", marginTop:16 }}>{error}</Text> : null}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 안내 문구 */}
      <Text style={styles.desc1}>티켓 리셀 방지를 위한 본인 등록 절차입니다.</Text>
      <Text style={styles.desc2}>얼굴이 가이드라인 안에 들어오도록 위치시켜 주세요.</Text>
      {/* 가이드 박스 및 카메라 */}
      <View style={styles.guideBox}>
        <View style={styles.dottedRect}>
          {/* 카메라 뷰 */}
          <CameraView style={styles.camera} facing="front" ref={cameraRef} />
          {/* 얼굴 가이드라인(타원) */}
          <View style={styles.oval} pointerEvents="none" />
          {/* 가이드 텍스트 */}
          <View style={styles.guideTextBox}>
            <Text style={styles.guideText}>카메라를 정면으로 바라봐 주세요.</Text>
          </View>
        </View>
      </View>
      {/* 에러 메시지 표시 */}
      {error ? <Text style={{ color: "red", textAlign: "center" }}>{error}</Text> : null}
      {/* 얼굴 등록 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "등록 중..." : "얼굴 등록"}</Text>
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
                    navigation.navigate('CompanionRegisterScreen', {
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