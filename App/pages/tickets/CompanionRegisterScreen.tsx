import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CompanionRegisterScreen({ route, navigation }) {
  const companionCount = route.params?.companionCount ?? 1;
  const [companions, setCompanions] = useState(Array(companionCount).fill(''));
  const maxCompanions = 3;

  function handleAddCompanion() {
    if (companions.length < maxCompanions) {
      setCompanions([...companions, '']);
    }
  }

  function handleChangeText(text, idx) {
    const arr = [...companions];
    arr[idx] = text;
    setCompanions(arr);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack?.()}>
          <Ionicons name="chevron-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>동행자 등록</Text>
      </View>

      {/* 중앙 아이콘 */}
      <View style={styles.iconCircle}>
        <Ionicons name="person-outline" size={40} color="#E53E3E" />
      </View>

      {/* 안내 텍스트 */}
      <Text style={styles.title}>동행자의 앱 <Text style={{ fontWeight: 'bold' }}>ID</Text>를 등록해주세요</Text>
      <Text style={styles.desc}>등록된 동행자는 별도의 얼굴 인증이 필요합니다</Text>

      {/* 동행자 입력 카드 */}
      <ScrollView style={{ flexGrow: 0, marginTop: 24 }}>
        {companions.map((email, idx) => (
          <View key={idx} style={styles.companionInputCard}>
            <View style={styles.companionInputHeader}>
              <Text style={styles.companionInputLabel}>동행자 {idx + 1}</Text>
              {companions.length < maxCompanions && idx === companions.length - 1 && (
                <TouchableOpacity style={styles.companionInputAddBtn} onPress={handleAddCompanion}>
                  <Ionicons name="add" size={18} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={styles.companionInput}
              placeholder="동행자의 앱 이메일을 입력하세요"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={text => handleChangeText(text, idx)}
            />
          </View>
        ))}
      </ScrollView>

      {/* 안내 박스 */}
      <View style={styles.companionInfoBox}>
        <Ionicons name="alert-circle-outline" size={18} color="#EAB308" style={{ marginRight: 6 }} />
        <View>
          <Text style={styles.companionInfoTitle}>동행자 등록 안내</Text>
          <Text style={styles.companionInfoDesc}>
            동행자는 최대 3명까지 등록 가능하며, 모든 동행자는 24시간 이내에 얼굴 인증을 완료해야 합니다.
          </Text>
        </View>
      </View>

      {/* 등록 완료 버튼 */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>등록 완료</Text>
      </TouchableOpacity>
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
  iconCircle: {
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 12,
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center', alignItems: 'center',
  },
  title: {
    fontSize: 17, fontWeight: '400', color: '#222', textAlign: 'center',
    marginTop: 4,
  },
  desc: {
    fontSize: 13, color: '#6B7280', textAlign: 'center',
    marginTop: 4, marginBottom: 0,
  },
  companionInputCard: {
    backgroundColor: '#F7F8FA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  companionInputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  companionInputLabel: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
  companionInputAddBtn: {
    marginLeft: 'auto',
    padding: 4,
  },
  companionInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F7F8FA',
    padding: 12,
    fontSize: 14,
    color: '#222',
    marginTop: 4,
  },
  companionInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEFCE8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  companionInfoTitle: {
    color: '#A16207',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  companionInfoDesc: {
    color: '#CA8A04',
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#E53E3E', borderRadius: 8,
    marginHorizontal: 16, marginTop: 8, paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '500', fontSize: 16 },
});
