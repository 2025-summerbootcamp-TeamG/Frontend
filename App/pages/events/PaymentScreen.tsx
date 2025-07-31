import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import DirectDepositIcon from "../../assets/payment/directdepositIcon.svg";
import CheckIcon from "../../assets/common/CheckIcon.svg";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { events } from "../../assets/events/EventsMock";
import { payForTicket } from "../../services/EventService";
import { buyTickets } from "../../services/EventService";
import * as LocalAuthentication from "expo-local-authentication";

const HEADER_HEIGHT = 48;
const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

export default function PaymentScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {
    event,
    event_time,
    selected,
    purchase_id,
    ticketIds,
    seatInfos: paramSeatInfos,
  } = (route.params || {}) as {
    event: any;
    event_time?: any;
    selected?: string[];
    purchase_id?: number;
    ticketIds?: number[];
    seatInfos?: any[];
  };

  // seatInfos는 paramSeatInfos로만 사용, undefined 방지
  const seatInfos: any[] = paramSeatInfos || [];
  console.log("seatInfos:", seatInfos);

  const [paymentMethod, setPaymentMethod] = useState("무통장입금");
  const [depositor, setDepositor] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [agree, setAgree] = useState(false);

  // 에러 메시지 상태 추가
  const [errorMsg, setErrorMsg] = useState("");

  // 기존 seatInfos 추출 로직 전체 제거
  const seatPrice = seatInfos.reduce((sum, s) => sum + s.price, 0);
  const fee = 1000;
  const total = seatPrice + fee;

  // 결제 후 발급받은 티켓의 고유 ID를 저장하는 상태
  const [ticketIdsState, setTicketIdsState] = useState<number[] | null>(
    ticketIds || null
  ); // 여러 티켓 ID 지원

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#fff", marginTop: 16 }}
        contentContainerStyle={{ padding: 0 }}
      >
        {/* 예매 정보 */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>예매 정보</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>공연명</Text>
            <Text style={styles.infoValue}>{event?.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>공연일시</Text>
            <Text style={styles.infoValue}>{event?.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>공연장소</Text>
            <Text style={styles.infoValue}>{event?.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>좌석정보</Text>
            <Text style={styles.infoValue}>
              {seatInfos.length > 0
                ? seatInfos.map((s) => `${s.zone}석 ${s.name}`).join(", ")
                : "좌석을 선택하세요"}
            </Text>
          </View>
        </View>

        {/* 결제 수단 선택 */}
        <Text style={styles.sectionTitle}>결제 수단 선택</Text>
        <View style={styles.methodList}>
          <TouchableOpacity
            style={styles.methodItem}
            onPress={() => setPaymentMethod("무통장입금")}
            activeOpacity={0.7}
          >
            <View style={styles.radioOuter}>
              {paymentMethod === "무통장입금" && (
                <View
                  style={[styles.radioInner, { backgroundColor: "#3182F6" }]}
                />
              )}
            </View>
            <DirectDepositIcon
              width={24}
              height={24}
              style={{ marginRight: 8, alignSelf: "center" }}
            />
            <Text style={styles.methodText}>무통장입금</Text>
          </TouchableOpacity>
        </View>

        {/* 무통장입금 선택 시 추가 정보 */}
        {paymentMethod === "무통장입금" && (
          <View style={styles.depositBox}>
            <Text style={styles.depositTitle}>입금 계좌 정보</Text>
            <View style={styles.depositInfoBox}>
              <Text style={styles.depositInfoMain}>
                신한은행 110-123-456789
              </Text>
              <Text style={styles.depositInfoSub}>(주)티켓예매</Text>
            </View>
            <Text style={styles.depositTitle}>입금자명</Text>
            <View style={styles.depositInfoBox}>
              <TextInput
                style={styles.depositInput}
                value={depositor}
                onChangeText={setDepositor}
                placeholder="입금자명을 입력하세요"
                placeholderTextColor="#BDBDBD"
              />
            </View>
            <Text style={styles.depositTitle}>입금 기한</Text>
            <View style={styles.depositInfoBox}>
              <Text style={styles.depositDeadline}>2025-08-02 23:59까지</Text>
            </View>
            <View style={styles.depositNoticeBox}>
              <Text style={styles.depositNoticeTitle}>
                ⚠ 무통장입금 주의사항
              </Text>
              <Text style={styles.depositNoticeText}>
                • 입금 기한 내 미입금 시 자동 취소됩니다.{"\n"}• 입금자명이 다를
                경우 입금 확인이 지연될 수 있습니다.{"\n"}• 현금영수증은
                마이페이지에서 신청 가능합니다.
              </Text>
            </View>
          </View>
        )}

        {/* 예매자 정보 */}
        <Text style={styles.sectionTitle}>예매자 정보</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>이름</Text>
          <TextInput
            style={styles.input}
            value={buyerName}
            onChangeText={setBuyerName}
            placeholder="이름을 입력하세요"
            placeholderTextColor="#BDBDBD"
          />
          <Text style={styles.inputLabel}>연락처</Text>
          <TextInput
            style={styles.input}
            value={buyerPhone}
            onChangeText={setBuyerPhone}
            placeholder="연락처를 입력하세요"
            placeholderTextColor="#BDBDBD"
          />
          <Text style={styles.inputLabel}>이메일</Text>
          <TextInput
            style={styles.input}
            value={buyerEmail}
            onChangeText={setBuyerEmail}
            placeholder="이메일을 입력하세요"
            placeholderTextColor="#BDBDBD"
          />
        </View>

        {/* 결제 금액 */}
        <View style={styles.priceBox}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              {seatInfos.length > 0
                ? seatInfos.map((s) => `${String(s["zone"])} 석 x 1`).join(", ")
                : "좌석 미선택"}
            </Text>
            <Text style={styles.priceValue}>
              {seatInfos.length > 0 ? `₩${seatPrice.toLocaleString()}` : "-"}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>예매 수수료</Text>
            <Text style={styles.priceValue}>₩{fee.toLocaleString()}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceTotal}>총 결제금액</Text>
            <Text style={styles.priceTotalValue}>
              ₩{total.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* 동의 체크 및 버튼 */}
        <View style={styles.checkRow}>
          <TouchableOpacity
            style={styles.checkBox}
            onPress={() => setAgree(!agree)}
            activeOpacity={0.7}
          >
            {agree && (
              <CheckIcon
                width={18}
                height={18}
                style={{ margin: 0, padding: 0, display: "flex" }}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.checkText}>
            주문 내용을 확인하였으며, 결제에 동의합니다.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={async () => {
            if (!buyerName || !buyerPhone || !buyerEmail) {
              setErrorMsg("예매자 정보가 누락되었습니다.");
              return;
            }
            if (!agree) {
              setErrorMsg("결제 동의에 체크해 주세요.");
              return;
            }
            setErrorMsg("");
            try {
              if (!purchase_id) {
                setErrorMsg(
                  "구매 정보가 올바르지 않습니다. 다시 시도해 주세요."
                );
                return;
              }
              // 1. 결제 API 먼저 호출
              const result = await payForTicket(String(purchase_id), {
                name: buyerName,
                phone: buyerPhone,
                email: buyerEmail,
              });
              setTicketIdsState(
                result.data.ticketIds || result.data.ticket_ids || []
              ); // ticketIds: 배열
              // iOS Face ID 인증 로직 완전히 제거 (안드로이드와 동일하게 FaceRegisterScreen에서만 실행)
              // 3. 결제 성공 시 내 티켓(FaceRegisterScreen)으로 이동
              navigation.navigate("내 티켓", {
                screen: "FaceRegisterScreen",
                params: {
                  event,
                  event_time,
                  selected,
                  purchase_id,
                  ticketIds,
                  seatInfos,
                },
              });
            } catch (e) {
              setErrorMsg("결제 처리 중 오류가 발생했습니다.");
            }
          }}
        >
          <Text style={styles.payBtnText}>결제 완료하기</Text>
        </TouchableOpacity>
        {/* 에러 메시지 표시 */}
        {errorMsg !== "" && (
          <Text
            style={{
              color: "#E53E3E",
              textAlign: "center",
              marginBottom: 16,
              marginTop: -10,
              fontSize: 14,
            }}
          >
            {errorMsg}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    backgroundColor: "#F5F6FA",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 20,
  },
  infoBoxTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  infoLabel: { color: "#6B7280", fontSize: 14 },
  infoValue: { color: "#222", fontSize: 14, fontWeight: "bold" },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 16,
    marginBottom: 10,
  },
  methodList: { marginHorizontal: 16, marginBottom: 10 },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3182F6",
  },
  methodText: { fontSize: 15, color: "#222", fontWeight: "500" },
  depositBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  depositTitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 10,
    marginBottom: 4,
    fontWeight: "bold",
  },
  depositInfoBox: {
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  depositInfoMain: { fontSize: 15, color: "#222", fontWeight: "bold" },
  depositInfoSub: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  depositInput: {
    fontSize: 15,
    color: "#222",
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    height: 20,
  },
  depositDeadline: { fontSize: 15, color: "#E53E3E", fontWeight: "bold" },
  depositNoticeBox: {
    backgroundColor: "#FFF9E1",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#F6E6A8",
  },
  depositNoticeTitle: {
    color: "#B98A00",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 2,
  },
  depositNoticeText: { color: "#B98A04", fontSize: 13, lineHeight: 20 },
  inputBox: { marginHorizontal: 16, marginBottom: 18 },
  inputLabel: { fontSize: 13, color: "#6B7280", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    padding: 10,
    fontSize: 15,
    marginTop: 2,
    backgroundColor: "#F9FAFB",
    color: "#222",
  },
  priceBox: {
    backgroundColor: "#F5F6FA",
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 18,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  priceLabel: { color: "#6B7280", fontSize: 14 },
  priceValue: { color: "#222", fontSize: 14 },
  priceTotal: { color: "#222", fontWeight: "bold", fontSize: 15 },
  priceTotalValue: { color: "#E53E3E", fontWeight: "bold", fontSize: 15 },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    marginBottom: 18,
  },
  checkBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#3182F6",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    margin: 0,
  },
  checkBoxChecked: {
    borderColor: "#3182F6",
    backgroundColor: "#3182F6",
  },
  checkBoxInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: "#fff",
  },
  checkText: { marginLeft: 8, fontSize: 13, color: "#222" },
  payBtn: {
    backgroundColor: "#E53E3E",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    marginHorizontal: 16,
    marginBottom: 30,
  },
  payBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  // 추가: BankNoticeBox에서 사용하는 스타일
  noticeBox: {
    backgroundColor: "#FEFCE8",
    borderColor: "#FEF08A",
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    margin: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrap: {
    marginRight: 12,
    marginTop: 2,
  },
  noticeTitle: {
    color: "#B45309",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  noticeText: {
    color: "#CA8A04",
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 24,
    marginBottom: 0,
  },
});

export function BankNoticeBox() {
  return (
    <View style={styles.noticeBox}>
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Svg width={24} height={24}>
            <Circle cx={12} cy={12} r={12} fill="#FEF08A" />
            <SvgText
              x={12}
              y={17}
              fontSize="18"
              fontWeight="bold"
              fill="#CA8A04"
              textAnchor="middle"
            >
              !
            </SvgText>
          </Svg>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.noticeTitle}>무통장입금 주의사항</Text>
          <Text style={styles.noticeText}>
            • 입금 기한 내 미입금 시 자동 취소됩니다.
          </Text>
          <Text style={styles.noticeText}>
            • 입금자명이 다를 경우 입금 확인이 지연될 수 있습니다.
          </Text>
          <Text style={styles.noticeText}>
            • 현금영수증은 마이페이지에서 신청 가능합니다.
          </Text>
        </View>
      </View>
    </View>
  );
}

const bankNoticeStyles = StyleSheet.create({
  noticeBox: {
    backgroundColor: "#FEFCE8",
    borderColor: "#FEF08A",
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    margin: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrap: {
    marginRight: 12,
    marginTop: 2,
  },
  noticeTitle: {
    color: "#B45309",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  noticeText: {
    color: "#CA8A04",
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 24,
    marginBottom: 0,
  },
});
