import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import modalStyles from '../../styles/user/modal';
import { signup } from "../../services/UserService";

export default function SignupModal({ visible, onClose, onSignup, onShowLogin }: { visible: boolean; onClose: () => void; onSignup?: () => void; onShowLogin?: () => void }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordCheck, setPasswordCheck] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [agree, setAgree] = React.useState(false);

  const handleSignup = async () => {
    if (!name) {
      Alert.alert('입력 오류', '이름을 입력하세요');
      return;
    }
    if (!email) {
      Alert.alert('입력 오류', '이메일을 입력하세요');
      return;
    }
    if (!password) {
      Alert.alert('입력 오류', '비밀번호를 입력하세요');
      return;
    }
    if (!passwordCheck) {
      Alert.alert('입력 오류', '비밀번호 확인을 입력하세요');
      return;
    }
    if (password !== passwordCheck) {
      Alert.alert('입력 오류', '비밀번호와 비밀번호 확인이 일치하지 않습니다');
      return;
    }
    if (!agree) {
      Alert.alert('입력 오류', '이용약관 및 개인정보처리방침에 동의해야 합니다');
      return;
    }
    try {
      await signup({ email, password, password2: passwordCheck, name, phone });
      Alert.alert("회원가입 성공", "회원가입이 완료되었습니다");
      if (onSignup) onSignup();
    } catch (err: any) {
      console.log("Error message:", err.message);

      const msg =
        err?.response?.data?.email?.[0] ||
        err?.response?.data?.password2 ||
        err?.response?.data?.message ||
        "회원가입 실패";
      Alert.alert("회원가입 실패", msg);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalBox}>
          {/* 헤더 */}
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>회원가입</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color="#222" />
            </Pressable>
          </View>
          {/* 이름 입력 */}
          <View style={{ marginBottom: 12 }}>
            <Text style={modalStyles.label}>이름</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="이름을 입력하세요"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#bdbdbd"
            />
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
              textContentType="oneTimeCode"
              placeholderTextColor="#bdbdbd"
            />
          </View>
          {/* 비밀번호 확인 입력 */}
          <View style={{ marginBottom: 12 }}>
            <Text style={modalStyles.label}>비밀번호 확인</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="비밀번호를 다시 입력하세요"
              value={passwordCheck}
              onChangeText={setPasswordCheck}
              secureTextEntry
              textContentType="oneTimeCode"
              placeholderTextColor="#bdbdbd"
            />
          </View>
          {/* 전화번호 입력 */}
          <View style={{ marginBottom: 12 }}>
            <Text style={modalStyles.label}>전화번호</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="전화번호를 입력하세요"
              value={phone}
              onChangeText={setPhone}
              keyboardType="default"
              placeholderTextColor="#bdbdbd"
            />
          </View>
          {/* 약관 동의 */}
          <TouchableOpacity style={modalStyles.agreeRow} onPress={() => setAgree(!agree)}>
            <View style={[modalStyles.checkbox, agree && modalStyles.checkboxChecked]}>
              {agree && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={modalStyles.agreeText}>이용약관 및 개인정보처리방침에 동의합니다</Text>
          </TouchableOpacity>
          {/* 가입하기 버튼 */}
          <TouchableOpacity style={modalStyles.signupBtn} onPress={handleSignup}>
            <Text style={modalStyles.signupBtnText}>가입하기</Text>
          </TouchableOpacity>
          {/* 로그인 안내 */}
          <View style={modalStyles.bottomRow}>
            <Text style={{ fontSize: 14 }}>이미 계정이 있으신가요? </Text>
            <TouchableOpacity onPress={onShowLogin}>
              <Text style={modalStyles.loginText}>로그인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
