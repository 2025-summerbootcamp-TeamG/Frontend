import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  Feather,
  AntDesign,
} from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { AuthHistoryModal } from "./AuthHistoryModal";
import MainHeader from "../../components/common/MainHeader";
import { logout } from "../../services/UserService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyPageLogin() {
  const navigation = useNavigation() as any;
  const [user, setUser] = React.useState<{
    name: string;
    email: string;
  } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loginModalVisible, setLoginModalVisible] = React.useState(false);
  const [signupModalVisible, setSignupModalVisible] = React.useState(false);

  // 앱 실행 시 로그인 상태 복구
  useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (accessToken) {
        try {
          const decoded = jwtDecode<{ name: string; email: string }>(accessToken);
          setUser({ name: decoded.name, email: decoded.email });
          setIsLoggedIn(true);
        } catch (e) {
          setIsLoggedIn(false);
          setUser(null);
        }
      };
      checkLoginStatus();
    }, [])
  );

  // 로그인 성공 시
  const handleLoginSuccess = async (data: any) => {
    try {
      const decoded = jwtDecode<{ name: string; email: string }>(data.access);
      setUser({ name: decoded.name, email: decoded.email });
      setIsLoggedIn(true);
      setLoginModalVisible(false);
    } catch {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // 회원가입 성공 시
  const handleSignupSuccess = () => {
    setIsLoggedIn(false);
    setSignupModalVisible(false);
  };

  // 완전 리팩토링한 로그아웃 함수

  const handleLogout = async () => {
    // 1. 토큰 삭제 및 상태 초기화 (무조건 실행)
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    setUser(null);
    setIsLoggedIn(false);

    // 2. 서버 로그아웃은 시도만 하고 실패해도 무시
    try {
      const refresh = await AsyncStorage.getItem("refreshToken");
      if (refresh) {
        await logout(refresh);
      }
    } catch (e) {
      // 네트워크/만료/이미 블랙리스트 등 모든 에러는 무시
      console.warn("서버 로그아웃 실패(무시):", e);
    }
  };

  return (
    <View style={styles.container}>
      <MainHeader />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* 로그인 전 UI */}
        {!isLoggedIn ? (
          <View style={styles.profileSection}>
            <View style={styles.profileIconWrapper}>
              <Ionicons name="person" size={48} color="#bbb" />
            </View>
            <Text style={styles.loginPrompt}>로그인하세요</Text>
            <View style={styles.loginButtonRow}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => setLoginModalVisible(true)}
              >
                <Text style={styles.loginButtonText}>로그인</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => setSignupModalVisible(true)}
              >
                <Text style={styles.signupButtonText}>회원가입</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // 로그인 후 UI
          <View style={styles.profileSection}>
            <View style={styles.profileIconWrapper}>
              <Ionicons name="person" size={48} color="#bbb" />
            </View>
            {user && (
              <>
                <Text style={styles.profileName}>{user.name}</Text>
                <Text style={styles.profileEmail}>{user.email}</Text>
              </>
            )}
            <TouchableOpacity style={styles.profileEditBtn}>
              <Text style={styles.profileEditBtnText}>프로필 편집</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 계정 관리 */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>계정 관리</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.cardRow}>
              <MaterialIcons name="person-outline" size={24} color="#888" />
              <View style={styles.cardTextWrapper}>
                <Text style={styles.cardTitle}>개인정보 관리</Text>
                <Text style={styles.cardDesc}>프로필, 연락처 정보 수정</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#bbb" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cardRow}>
              <Ionicons name="settings-outline" size={24} color="#888" />
              <View style={styles.cardTextWrapper}>
                <Text style={styles.cardTitle}>설정</Text>
                <Text style={styles.cardDesc}>알림, 보안, 언어 설정</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#bbb" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cardRow, { borderBottomWidth: 0 }]}
              onPress={() => navigation.navigate("AuthHistoryModal")}
            >
              <AntDesign name="idcard" size={22} color="#888" />
              <View style={styles.cardTextWrapper}>
                <Text style={styles.cardTitle}>인증 내역</Text>
                <Text style={styles.cardDesc}>얼굴 인증 및 본인 확인 기록</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#bbb" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 앱 정보 */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>앱 정보</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.cardRow}>
              <Ionicons name="notifications-outline" size={24} color="#888" />
              <View style={styles.cardTextWrapper}>
                <Text style={styles.cardTitle}>공지사항</Text>
                <Text style={styles.cardDesc}>앱 업데이트 및 중요 알림</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#bbb" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cardRow}>
              <Feather name="file-text" size={22} color="#888" />
              <View style={styles.cardTextWrapper}>
                <Text style={styles.cardTitle}>이용약관</Text>
                <Text style={styles.cardDesc}>
                  서비스 이용약관 및 개인정보처리방침
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#bbb" />
            </TouchableOpacity>
            <View style={[styles.cardRow, { borderBottomWidth: 0 }]}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#888"
              />
              <View style={styles.cardTextWrapper}>
                <Text style={styles.cardTitle}>버전 정보</Text>
                <Text style={styles.cardDesc}>현재 버전 1.2.3</Text>
              </View>
              <Text style={styles.versionText}>최신 버전</Text>
            </View>
          </View>
        </View>

        {/* 로그아웃 버튼 */}
        {isLoggedIn && (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>로그아웃</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* 로그인/회원가입 모달 */}
      <LoginModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        onLoginSuccess={handleLoginSuccess}
        onShowSignup={() => {
          setLoginModalVisible(false);
          setSignupModalVisible(true);
        }}
      />
      <SignupModal
        visible={signupModalVisible}
        onClose={() => setSignupModalVisible(false)}
        onSignup={handleSignupSuccess}
        onShowLogin={() => {
          setSignupModalVisible(false);
          setLoginModalVisible(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // ... 동일
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ef4444",
  },
  logo: { color: "white", fontSize: 20, fontWeight: "bold" },
  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  profileIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  loginPrompt: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  loginButtonRow: { flexDirection: "row", gap: 12 },
  loginButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 9999,
    marginRight: 12,
  },
  loginButtonText: { color: "white", fontWeight: "600" },
  signupButton: {
    borderWidth: 1,
    borderColor: "#ef4444",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  signupButtonText: { color: "#ef4444", fontWeight: "600" },
  profileName: { fontSize: 18, fontWeight: "700", marginBottom: 2 },
  profileEmail: { fontSize: 14, color: "#888", marginBottom: 10 },
  profileEditBtn: {
    borderWidth: 1,
    borderColor: "#e11d48",
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginBottom: 4,
  },
  profileEditBtnText: { color: "#e11d48", fontWeight: "600", fontSize: 14 },
  sectionWrapper: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  cardTextWrapper: { marginLeft: 12, flex: 1 },
  cardTitle: { fontWeight: "500" },
  cardDesc: { fontSize: 12, color: "#9ca3af" },
  versionText: { fontSize: 12, color: "#9ca3af" },
  logoutBtn: {
    borderWidth: 1,
    borderColor: "#e11d48",
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  logoutBtnText: { color: "#e11d48", fontWeight: "bold", fontSize: 16 },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 56,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: { alignItems: "center" },
  tabText: { fontSize: 12, color: "#6b7280", marginTop: 4 },
});
