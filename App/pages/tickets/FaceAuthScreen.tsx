// Frontend/App/pages/user/FaceAuthScreen.tsx

import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Camera from 'expo-camera'; // 추가!

export default function FaceAuthScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [type, setType] = useState('front'); // 'front' 또는 'back'
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

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

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack?.()}>
          <Ionicons name="chevron-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>얼굴 인증</Text>
      </View>

      {/* 설명 */}
      <Text style={styles.desc1}>
        티켓 리셀 방지를 위한 본인 인증 절차입니다.
      </Text>
      <Text style={styles.desc2}>
        얼굴이 가이드라인 안에 들어오도록 위치시켜 주세요.
      </Text>

      {/* 얼굴 가이드라인 박스 */}
      <View style={styles.guideBox}>
        <View style={styles.dottedRect}>
          {/* 카메라 프리뷰 */}
          <CameraView
            style={styles.camera}
            facing={type}
            ref={cameraRef}
          />
          {/* 빨간 타원 오버레이 */}
          <View style={styles.oval} pointerEvents="none" />
          {/* 안내 텍스트 */}
          <View style={styles.guideTextBox}>
            <Text style={styles.guideText}>카메라를 정면으로 바라봐 주세요.</Text>
          </View>
        </View>
      </View>

      {/* 안내 박스 */}
      <View style={styles.infoBox}>
        <Ionicons name="alert-circle-outline" size={20} color="#EAB308" style={{ marginRight: 8 }} />
        <View>
          <Text style={styles.infoTitle}>얼굴 인증 후 동행자 등록</Text>
          <Text style={styles.infoDesc}>얼굴 인증 완료 후, 동행자를 등록할 수 있습니다.</Text>
        </View>
      </View>

      {/* 인증 완료 버튼 */}
      <TouchableOpacity style={styles.button} onPress={() => {
        setIsSuccess(true); // 성공
        setModalVisible(true);
      }}>
        <Text style={styles.buttonText}>인증 완료(성공)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { marginTop: 8, backgroundColor: '#EF4444' }]}
        onPress={() => {
          setIsSuccess(false); // 실패
          setModalVisible(true);
        }}>
        <Text style={styles.buttonText}>인증 완료(실패)</Text>
      </TouchableOpacity>

      {/* 인증 성공/실패 모달 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={[
              styles.modalIconCircle,
              { backgroundColor: isSuccess ? '#D1FADF' : '#FEE2E2' }
            ]}>
              {isSuccess ? (
                <Ionicons name="checkmark" size={40} color="#22C55E" />
              ) : (
                <Ionicons name="close" size={40} color="#EF4444" />
              )}
            </View>
            <Text style={styles.modalTitle}>인증 완료</Text>
            <Text style={styles.modalDesc}>
              {isSuccess
                ? '얼굴 인증이 성공적으로 완료되었습니다.'
                : '얼굴을 가이드라인에 맞추어 다시 촬영해주세요.'}
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222', marginLeft: 8 },
  desc1: {
    color: '#4B5563', fontSize: 14, textAlign: 'center',
    marginTop: 8, marginHorizontal: 24, fontWeight: '400',
  },
  desc2: {
    color: '#4B5563', fontSize: 14, textAlign: 'center',
    marginBottom: 16, marginHorizontal: 24, fontWeight: '400',
  },
  guideBox: { alignItems: 'center', marginBottom: 16 },
  dottedRect: {
    width: 343, height: 300, borderRadius: 8,
    borderWidth: 2, borderColor: '#E53E3E', borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center', position: 'relative',
    overflow: 'hidden', // 카메라가 박스 밖으로 안 나가게
  },
  camera: {
    width: 343, height: 300, position: 'absolute', top: 0, left: 0,
  },
  oval: {
    position: 'absolute',
    top: 40, left: 81.5,
    width: 180, height: 220,
    borderWidth: 2, borderColor: '#E53E3E',
    borderTopLeftRadius: 100, borderTopRightRadius: 100,
    borderBottomLeftRadius: 80, borderBottomRightRadius: 80,
    backgroundColor: 'transparent',
  },
  guideTextBox: {
    position: 'absolute',
    left: 86.75, top: 224,
    width: 170, height: 40,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 999,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    paddingHorizontal: 8,
  },
  guideText: { color: '#222', fontSize: 14, fontWeight: '400', textAlign: 'center' },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#FEFCE8', borderRadius: 16,
    borderWidth: 1, borderColor: '#FEF08A',
    padding: 17, marginHorizontal: 16, marginTop: 24,
  },
  infoTitle: { color: '#A16207', fontWeight: '500', fontSize: 14 },
  infoDesc: { color: '#CA8A04', fontSize: 12, marginTop: 2 },
  button: {
    backgroundColor: '#E53E3E', borderRadius: 8,
    marginHorizontal: 16, marginTop: 24, paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '500', fontSize: 16 },

  // 모달 스타일
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalBox: {
    width: 320, backgroundColor: '#fff', borderRadius: 16,
    alignItems: 'center', padding: 28, shadowColor: '#000',
    shadowOpacity: 0.1, shadowRadius: 16, elevation: 8,
  },
  modalIconCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#D1FADF', justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14, color: '#4B5563', marginBottom: 24, textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#E53E3E', borderRadius: 8,
    width: '100%', paddingVertical: 12, alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff', fontWeight: '500', fontSize: 16,
  },
});
