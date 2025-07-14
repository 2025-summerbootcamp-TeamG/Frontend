import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import modalStyles from '../../styles/user/modal';

export default function SignupModal({ visible, onClose, onSignup }: { visible: boolean; onClose: () => void; onSignup?: () => void }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordCheck, setPasswordCheck] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [agree, setAgree] = React.useState(false);

  const handleSignup = () => {
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
    if (!phone) {
      Alert.alert('입력 오류', '전화번호를 입력하세요');
      return;
    }
    if (!agree) {
      Alert.alert('입력 오류', '이용약관 및 개인정보처리방침에 동의해야 합니다');
      return;
    }
    // 이메일 중복 예시: test@test.com이면 중복
    if (email === 'test@test.com') {
      Alert.alert('회원가입 실패', '이메일이 중복되었습니다');
      return;
    }
    // 성공
    Alert.alert('회원가입 성공', '회원가입이 완료되었습니다', [
      { text: '확인', onPress: () => { if (onSignup) onSignup(); } }
    ]);
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
              keyboardType="phone-pad"
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
            <TouchableOpacity>
              <Text style={modalStyles.loginText}>로그인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
