import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import modalStyles from '../../styles/user/modal';
import { login } from "../../services/UserService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginModal({ visible, onClose, onLoginSuccess, onShowSignup }: { visible: boolean; onClose: () => void; onLoginSuccess?: (data?: any) => void; onShowSignup?: () => void }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [autoLogin, setAutoLogin] = React.useState(false);

  
  const handleLogin = async () => {
    try {
      const data = await login({ email, password });
      // data: { access, refresh }
      await AsyncStorage.setItem("accessToken", data.access);
      await AsyncStorage.setItem("refreshToken", data.refresh);
      if (onLoginSuccess) onLoginSuccess(data);
    } catch (err: any) {
      Alert.alert(
        "로그인 실패",
        err?.response?.data?.detail || err?.response?.data?.message || "로그인 실패"
      );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalBox}>
          {/* 헤더 */}
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>로그인</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color="#222" />
            </Pressable>
          </View>
          {/* 이메일 입력 */}
          <View style={{ marginBottom: 12 }}>
            <Text style={modalStyles.label}>이메일</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="이메일을 입력하세요"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#bdbdbd"
            />
          </View>
          {/* 비밀번호 입력 */}
          <View style={{ marginBottom: 12 }}>
            <Text style={modalStyles.label}>비밀번호</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#bdbdbd"
            />
          </View>
          {/* 자동 로그인 & 비밀번호 찾기 */}
          <View style={modalStyles.row}>
            <TouchableOpacity style={modalStyles.checkboxRow} onPress={() => setAutoLogin(!autoLogin)}>
              <View style={[modalStyles.checkbox, autoLogin && modalStyles.checkboxChecked]}>
                {autoLogin && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={modalStyles.checkboxLabel}>자동 로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={modalStyles.findPw}>비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>
          {/* 로그인 버튼 */}
          <TouchableOpacity style={modalStyles.loginBtn} onPress={handleLogin}>
            <Text style={modalStyles.loginBtnText}>로그인</Text>
          </TouchableOpacity>
          {/* 회원가입 안내 */}
          <View style={modalStyles.bottomRow}>
            <Text style={{ fontSize: 14 }}>아직 회원이 아니신가요? </Text>
            <TouchableOpacity onPress={onShowSignup}>
              <Text style={modalStyles.signupText}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
