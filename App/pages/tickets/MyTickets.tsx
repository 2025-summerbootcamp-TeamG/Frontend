import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Image,
  Alert,
} from "react-native";
import MainHeader from "../../components/common/MainHeader";
import QRCodeModal from "./QRCodeModal";
import TicketInfoModal from "./TicketInfoModal";
import { events } from "../../assets/events/EventsMock";
import { useFocusEffect } from "@react-navigation/native";
import LoginModal from "../user/LoginModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getMyTickets,
  getTicketDetail,
  getTicketFaceAuth,
  certifyTicket,
  TicketQRcode,
} from "../../services/TicketService";

// 좌석 번호에서 '-' 이후의 값만 추출하는 함수 (컴포넌트 바깥에 위치)
const displaySeatNumber = (seat_number: string) => {
  if (!seat_number) return "";
  const parts = seat_number.split("-");
  return parts.length > 1 ? parts[1] : seat_number;
};

// 티켓 카드 컴포넌트 (각 티켓 정보를 카드 형태로 렌더링)
interface TicketCardProps {
  ticket: TicketType & { [key: string]: any };
  navigation?: any;
  onQrPress: (ticket: TicketType) => void;
  onDetailPress: (ticket: TicketType) => void;
  onPrimaryButtonPress: (ticket: TicketType) => void;
}

const TicketCard = ({
  ticket,
  navigation,
  onQrPress,
  onDetailPress,
  onPrimaryButtonPress,
}: TicketCardProps) => {
  // 상태 확인용 콘솔 로그 (매 렌더링마다 출력)
  console.log(
    'TicketCard 렌더링:',
    'id:', ticket.id,
    'face_verified:', ticket.face_verified,
    'ticket_status:', ticket.ticket_status
  );
  const status = ticket.ticket_status ?? "";
  const verified = ticket.face_verified;
  // 박스 색상 및 텍스트 분기 (상태/버튼 기준)
  let statusBoxText = '';
  let statusBoxColor = undefined;
  if (verified === false) {
    statusBoxText = '등록필요';
    statusBoxColor = '#FFF9D6'; // 노란색
  } else if (verified === true && status === 'reserved') {
    statusBoxText = '예매완료';
    statusBoxColor = '#FFF9D6'; // 노란색
  } else if (verified === true && status === 'checked_in') {
    statusBoxText = '인증완료';
    statusBoxColor = '#DCFCE7'; // 초록색
  } else {
    statusBoxText = '';
    statusBoxColor = undefined;
  }

  // 버튼 렌더링 분기
  let buttonLabel = ""; // 버튼에 표시할 텍스트
  let buttonAction: ((event: any) => void) | undefined = undefined; // 버튼 클릭 시 실행할 함수

  if (verified === undefined) {
    buttonLabel = "로딩 중..."
    buttonAction = undefined;
  } else if (verified === false) {
    buttonLabel = "얼굴 등록하기";
    buttonAction = () => onPrimaryButtonPress({ ...ticket, primaryButtonAction: "register" });
  } else if (verified === true && status === "reserved") {
    buttonLabel = "얼굴 인증하기";
    buttonAction = () => onPrimaryButtonPress({ ...ticket, primaryButtonAction: "verify" });
  } else if (verified === true && status === "checked_in") {
    buttonLabel = "QR코드 보기";
    buttonAction = () => onPrimaryButtonPress({ ...ticket, primaryButtonAction: "qr" });
  }

  return (
    <View style={styles.card}>
      <View style={styles.marginWrap}>
        {ticket.image_url && ticket.image_url !== "null" ? (
          <Image
            source={{ uri: ticket.image_url }}
            style={styles.blankImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.blankImage} />
        )}
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.cardTitle}>{ticket.name}</Text>
            {statusBoxText ? (
              <View style={{
                ...getStatusBoxStyle(statusBoxText).box,
                backgroundColor: statusBoxColor,
              }}>
                <Text style={getStatusBoxStyle(statusBoxText).text}>{statusBoxText}</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.marginWrap1}>
          <View style={styles.p30}>
            <Text style={styles.cardInfo}>
              {ticket.ticket_date !== "null" && ticket.ticket_date
                ? ticket.ticket_date
                : Array.isArray(ticket.event_times) &&
                  ticket.event_times.length > 0
                ? formatEventTime(ticket.event_times[0])
                : ticket.date}
            </Text>
          </View>
        </View>
        <View style={styles.p30}>
          <Text style={styles.cardInfo}>{ticket.location}</Text>
        </View>
        <View style={styles.marginWrap1}>
          <View style={styles.p30}>
            <Text style={styles.cardInfo}>
              {ticket.seat_grade && ticket.seat_number
                ? `${ticket.seat_grade}-${displaySeatNumber(
                    ticket.seat_number
                  )}`
                : ticket.seat_number
                ? displaySeatNumber(ticket.seat_number)
                : ""}
            </Text>
          </View>
        </View>
        <View style={styles.marginWrap3}>
          <View style={styles.div39}>
            <TouchableOpacity
              style={styles.showqrcode140}
              onPress={buttonAction}
              disabled={!buttonAction}
            >
              <Text style={styles.qr42} numberOfLines={1} ellipsizeMode="tail">
                {buttonLabel}
              </Text>
            </TouchableOpacity>

            <View style={styles.marginWrap4}>
              <TouchableOpacity
                style={styles.showdetails143}
                onPress={() => onDetailPress(ticket)}
              >
                <Text style={styles.text3}>상세정보</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// 날짜/시간 포맷 함수 추가
function formatEventTime(eventTime: any) {
  if (!eventTime) return "";
  const date = new Date(eventTime.event_date + "T" + eventTime.start_time);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const week = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  const hour = eventTime.start_time.slice(0, 2);
  const minute = eventTime.start_time.slice(3, 5);
  return `${month}월 ${day}일 (${week}) ${hour}:${minute}`;
}

interface MyTicketsProps {
  navigation?: any;
}

const filterOptions = [
  { label: "전체", value: "전체" },
  { label: "예정", value: "예정" },
  { label: "지난", value: "지난" },
];

// TicketType에 실제 사용하는 필드 추가
export interface TicketType {
  id: number;
  name?: string;
  artist?: string;
  date?: string;
  location?: string;
  price?: number;
  image_url?: string;
  seat_number?: string;
  seat_grade?: string;
  ticket_status?: string;
  ticket_statusText?: string;
  status?: string;
  type?: string;
  title?: string;
  ticket_date?: string;
  primaryButton?: string;
  primaryButtonAction?: string;
  isExpired?: boolean;
  event_times?: any[];
  face_verified?: boolean;
  genre?: string;
  reservationNo?: string;
  authDate?: string;
  verified_at?: string; // 추가
  is_deleted?: boolean; // 추가
}
function mapTicketToTicketType(ticket: any): TicketType {
  let ticket_statusText = ticket.ticket_statusText;
  let primaryButton = ticket.primaryButton;
  let primaryButtonAction = ticket.primaryButtonAction;

  // 목데이터에 값이 없으면 ticket_status 기준으로 fallback
  if (!ticket_statusText) { // ticket_statusText가 없으면(즉, undefined/null/빈값이면)
    if (ticket.ticket_status === "pending") ticket_statusText = "인증필요"; // 예매 후 인증이 필요한 상태
    else if (ticket.ticket_status === "reserved")
      ticket_statusText = "예매완료"; // 예매만 완료된 상태
    else if (["verified", "checked_in"].includes(ticket.ticket_status))
      ticket_statusText = "인증완료"; // 인증이 완료된 상태(입장 인증 등)
    else ticket_statusText = ticket.ticket_status; // 그 외에는 ticket_status 값을 그대로 사용
  }

  return {
    id: ticket.id,
    name: ticket.event_name ?? ticket.name ?? "",
    artist: ticket.artist ?? "",
    date: ticket.event_date ?? ticket.date ?? ticket.booked_at ?? "",
    location: ticket.event_location ?? ticket.location ?? "",
    price: ticket.ticket_price
      ? Number(ticket.ticket_price)
      : ticket.price ?? 0,
    image_url: ticket.image_url ?? "",
    seat_number: ticket.seat_number ?? "",
    seat_grade: ticket.seat_rank ?? ticket.seat_grade ?? "",
    ticket_status: ticket.ticket_status,
    ticket_statusText,
    face_verified: ticket.face_verified,
    primaryButton,
    primaryButtonAction,
    verified_at: ticket.verified_at ?? new Date().toISOString(), // 추가
    is_deleted: ticket.is_deleted ?? false, // 추가
  };
}

export default function MyTickets({ navigation }: MyTicketsProps) {
  const [activeFilter, setActiveFilter] = useState<string>("전체");
  const [qrModalVisible, setQrModalVisible] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);
  const [infoTicket, setInfoTicket] = useState<TicketType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginModalVisible, setLoginModalVisible] = useState<boolean>(false);
  const [tickets, setTickets] = useState<TicketType[]>([]); // 초기값 빈 배열, 서버 데이터만 사용
  const [loadingDetail, setLoadingDetail] = useState(false);

  // 로그인 상태 확인
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
      // if (!token) setLoginModalVisible(true); // 로그인 모달 띄우는 부분 주석 처리
    };
    checkLogin();
  }, []);

  // 로그인 성공 시 티켓 목록 불러오기
  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    setLoginModalVisible(false);
    try {
      const data = await getMyTickets();
      const validTickets = data.filter(
        (ticket) =>
          ticket.id !== undefined &&
          ticket.id !== null &&
          ticket.id > 0 &&
          !ticket.is_deleted &&
          (ticket.ticket_status === "reserved" ||
            ticket.ticket_status === "checked_in")
      );
      setTickets(validTickets.map(mapTicketToTicketType));
    } catch (e) {
      Alert.alert(
        "티켓 불러오기 실패",
        "서버에서 티켓 목록을 가져오지 못했습니다."
      );
    }
  };

  // 내 티켓 페이지가 포커스될 때마다 로그인 상태와 티켓 목록을 새로 불러오기

  const [qrData, setQrData] = useState<any>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;
      const fetchTickets = async () => {
        const token = await AsyncStorage.getItem("accessToken");
        setIsLoggedIn(!!token);
        if (!token) return;
        const myTickets = await getMyTickets();
        if (!isMounted) return;
        // ticket_status가 'canceled' 또는 'booked'인 티켓은 제외, reserved/checked_in만 남김
        const filteredTickets = myTickets.filter(
          ticket =>
            ticket.ticket_status !== 'canceled' &&
            ticket.ticket_status !== 'booked' &&
            (ticket.ticket_status === "reserved" || ticket.ticket_status === "checked_in")
        );
        const mappedTickets = filteredTickets.map(mapTicketToTicketType);
        setTickets(mappedTickets);

        // getMyTickets로 받은 후에 verified 동기화
        const faceAuthResults = await Promise.all(
          mappedTickets.map(async (ticket) => {
            try {
              const res = await getTicketFaceAuth(ticket.id);
              return { id: ticket.id, face_verified: res.data?.face_verified };
            } catch {
              return { id: ticket.id, face_verified: undefined };
            }
          })
        );
        if (!isMounted) return;
        setTickets(tickets =>
          tickets.map(ticket => {
            const found = faceAuthResults.find(f => f.id === ticket.id);
            return found ? { ...ticket, face_verified: found.face_verified } : ticket;
          })
        );
      };
      fetchTickets();
      return () => { isMounted = false; };
    }, [])
  );

  // 티켓 목록 불러온 후 각 티켓의 face_verified 상태를 DB에서 동기화 (개별 티켓별로 관리)
  useEffect(() => {
    if (tickets.length === 0) return;
    let isMounted = true;
    // 각 티켓별로 face_verified를 개별적으로 불러와서 업데이트
    Promise.all(
      tickets.map(async (ticket) => {
        try {
          const res = await getTicketFaceAuth(ticket.id);
          const face_verified = res.data?.face_verified;
          return { id: ticket.id, face_verified };
        } catch {
          return { id: ticket.id, face_verified: ticket.face_verified };
        }
      })
    ).then((faceAuthResults) => {
      if (!isMounted) return;
      // 기존 티켓 배열과 face_verified 결과를 merge
      const updatedTickets = tickets.map(ticket => {
        const found = faceAuthResults.find(f => f.id === ticket.id);
        return found ? { ...ticket, face_verified: found.face_verified } : ticket;
      });
      setTickets(updatedTickets);
    });
    return () => {
      isMounted = false;
    };
  }, [tickets.length]);

  // 티켓 목록을 state로 관리
  // const [tickets, setTickets] = useState(events);

  // 모달자동삭제: 상세정보 모달이 열려 있을 때, 해당 티켓이 목록에 없으면 자동으로 닫기
  // React.useEffect(() => {
  //   if (infoTicket && !tickets.find(t => t.id === infoTicket.id)) {
  //     setInfoModalVisible(false);
  //   }
  // }, [tickets, infoTicket]);

  // 오늘 날짜 (YYYY-MM-DD)
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // 티켓의 기준 날짜 구하기 (event_times가 있으면 가장 가까운 event_date, 없으면 date)
  function getTicketDate(ticket: any): string {
    if (Array.isArray(ticket.event_times) && ticket.event_times.length > 0) {
      // 여러 날짜 중 가장 가까운 미래 날짜, 없으면 가장 마지막 날짜
      const sorted = ticket.event_times
        .slice()
        .sort((a: any, b: any) => a.event_date.localeCompare(b.event_date));
      return sorted[0].event_date;
    }
    // date 필드가 YYYY.MM.DD 형식이면 YYYY-MM-DD로 변환
    if (ticket.date && ticket.date.includes(".")) {
      return ticket.date.replace(/\./g, "-");
    }
    return ticket.date || "";
  }

  // 날짜 비교: 예정/지난 분류
  function isUpcoming(ticket: any): boolean {
    const ticketDate = getTicketDate(ticket);
    return ticketDate >= todayStr;
  }
  function isPast(ticket: any): boolean {
    const ticketDate = getTicketDate(ticket);
    return ticketDate < todayStr;
  }

  // 티켓 정보가 없는(필드가 'null'인) 데이터는 리스트에서 제외
  let filteredTickets = tickets.filter(
    (ticket: any) =>
      ticket.ticket_status !== "null" &&
      ticket.ticket_seat !== "null"
    // primaryButton !== "null" 필터링은 제거!
  );

  if (activeFilter === "예정") {
    filteredTickets = filteredTickets.filter(isUpcoming);
  } else if (activeFilter === "지난") {
    filteredTickets = filteredTickets.filter(isPast);
  }

  // 예매 취소 성공 시 티켓 목록에서 제거
  const handleCancelSuccess = (ticketId: number) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
  };

  const handleQrPress = async (ticket: TicketType) => {
    setQrLoading(true);
    setQrError("");
    try {
      const data = await TicketQRcode(ticket.id!);
      setQrData(data);
      setSelectedTicket(ticket);
      setQrModalVisible(true);
    } catch (e: any) {
      setQrError("QR 코드 생성에 실패했습니다.");
      setQrModalVisible(true);
    } finally {
      setQrLoading(false);
    }
  };

  const handleDetailPress = async (ticket: TicketType) => {
    console.log("상세정보 요청 id:", ticket.id);
    setLoadingDetail(true);
    try {
      const detail = await getTicketDetail(ticket.id);
      setInfoTicket({
        id: detail.id,
        name: detail.event_name,
        date: detail.event_date,
        location: detail.event_location,
        seat_grade: detail.seat_rank,
        seat_number: displaySeatNumber(detail.seat_number),
        ticket_status: ticket.ticket_status, // 목록에서 가져옴
        ticket_statusText: ticket.ticket_statusText, // 목록에서 가져옴
        face_verified: detail.face_verified,
        image_url: detail.image_url,
        price: Number(detail.ticket_price) || 0,
        verified_at: detail.verified_at, // 인증 일시를 명확히 할당
        // 기타 필요한 필드 추가
        // reservationNo: detail.reservation_number,
        // total_price: detail.total_price,
        // ...
      });
      setInfoModalVisible(true);
    } catch (e) {
      Alert.alert(
        "상세정보 불러오기 실패",
        "서버에서 상세정보를 가져오지 못했습니다."
      );
    } finally {
      setLoadingDetail(false);
    }
  };

  const handlePrimaryButtonPress = (ticket: TicketType) => {
    if (ticket.primaryButtonAction === "qr") {
      handleQrPress(ticket);
    } else if (ticket.primaryButtonAction === "verify" && navigation) {
      navigation.navigate("FaceAuthScreen", {
        fromMyTickets: true,
        ticketId: ticket.id,
        onAuthSuccess: async (ticketId: number) => {
          try {
            // 1. 티켓 상태 checked_in으로 변경
            const res = await certifyTicket(ticketId);
            // 2. 프론트 상태 즉시 반영
            setTickets((prev: TicketType[]) =>
              prev.map((t) =>
                t.id === ticketId
                  ? {
                      ...t,
                      ticket_status: res.ticket.ticket_status,
                      ticket_statusText:
                        res.ticket.ticket_status === "checked_in"
                          ? "인증완료"
                          : res.ticket.ticket_status,
                      primaryButton:
                        res.ticket.ticket_status === "checked_in"
                          ? "QR코드 보기"
                          : t.primaryButton,
                      primaryButtonAction:
                        res.ticket.ticket_status === "checked_in"
                          ? "qr"
                          : t.primaryButtonAction,
                      verified_at:
                        res.ticket.verified_at ?? new Date().toISOString(),
                    }
                  : t
              )
            );
            // 3. 필요시 서버에서 전체 동기화
            const data = await getMyTickets();
            const validTickets = data.filter(
              (ticket) =>
                ticket.id !== undefined &&
                ticket.id !== null &&
                ticket.id > 0 &&
                !ticket.is_deleted &&
                (ticket.ticket_status === "reserved" ||
                  ticket.ticket_status === "checked_in")
            );
            setTickets(validTickets.map(mapTicketToTicketType));
          } catch (e) {
            Alert.alert("상태 변경 실패", "티켓 상태 변경에 실패했습니다.");
          }
        },
      });
    } else if (ticket.primaryButtonAction === "register" && navigation) {
      navigation.navigate("FaceRegisterScreen", { ticketId: ticket.id });
    } else {
      // fallback: face_verified와 status로 분기
      const status = ticket.ticket_status ?? "";
      const verified = ticket.face_verified;
      if (verified === undefined) {
        Alert.alert("로딩 중...", "얼굴 등록 상태를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
        return;
      } else if (verified === false) {
        navigation.navigate("FaceRegisterScreen", { ticketId: ticket.id });
        return;
      } else if (verified === true && status === "reserved") {
        navigation.navigate("FaceAuthScreen", {
          fromMyTickets: true,
          ticketId: ticket.id,
          onAuthSuccess: async (ticketId: number) => {
            try {
              const res = await certifyTicket(ticketId);
              setTickets((prev: TicketType[]) =>
                prev.map((t) =>
                  t.id === ticketId
                    ? {
                        ...t,
                        ticket_status: res.ticket.ticket_status,
                        ticket_statusText:
                          res.ticket.ticket_status === "checked_in"
                            ? "인증완료"
                            : res.ticket.ticket_status,
                        primaryButton:
                          res.ticket.ticket_status === "checked_in"
                            ? "QR코드 보기"
                            : t.primaryButton,
                        primaryButtonAction:
                          res.ticket.ticket_status === "checked_in"
                            ? "qr"
                            : t.primaryButtonAction,
                        verified_at:
                          res.ticket.verified_at ?? new Date().toISOString(),
                      }
                    : t
                )
              );
              const data = await getMyTickets();
              const validTickets = data.filter(
                (ticket) =>
                  ticket.id !== undefined &&
                  ticket.id !== null &&
                  ticket.id > 0 &&
                  !ticket.is_deleted &&
                  (ticket.ticket_status === "reserved" ||
                    ticket.ticket_status === "checked_in")
              );
              setTickets(validTickets.map(mapTicketToTicketType));
            } catch (e) {
              Alert.alert("상태 변경 실패", "티켓 상태 변경에 실패했습니다.");
            }
          },
        });
        return;
      } else if (verified === true && status === "checked_in") {
        handleQrPress(ticket);
        return;
      } else {
        Alert.alert("알 수 없는 상태", "이 티켓은 현재 처리할 수 없는 상태입니다.");
        return;
      }
    }
  };

  return (
    <>
      <MainHeader />
      {isLoggedIn ? null : (
        <LoginModal
          visible={loginModalVisible}
          onClose={() => setLoginModalVisible(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      <View style={{ width: "100%", padding: 16, backgroundColor: "#fff" }}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>내 티켓</Text>
          <View style={styles.filterRow}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterButton,
                  activeFilter === option.value && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter(option.value)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === option.value &&
                      styles.filterButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      {isLoggedIn ? (
        <ScrollView
          style={{ backgroundColor: "#fff", flex: 1 }}
          contentContainerStyle={{
            paddingBottom: 80,
            alignItems: "center",
            paddingTop: 0,
          }}
        >
          {filteredTickets.map((ticket: any) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onQrPress={handleQrPress}
              onDetailPress={handleDetailPress}
              navigation={navigation}
              onPrimaryButtonPress={handlePrimaryButtonPress}
            />
          ))}
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 40,
          }}
        >
          <Text style={{ color: "#888", fontSize: 16 }}>
            로그인 후 티켓을 확인할 수 있습니다.
          </Text>
        </View>
      )}
      <Modal
        visible={qrModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setQrModalVisible(false)}
      >
        <QRCodeModal
          ticket={selectedTicket}
          qrData={qrData}
          loading={qrLoading}
          error={qrError}
          onClose={() => {
            setQrModalVisible(false);
            setQrData(null);
            setQrError("");
          }}
        />
      </Modal>
      <TicketInfoModal
        visible={infoModalVisible}
        ticket={infoTicket}
        onClose={() => setInfoModalVisible(false)}
        navigation={navigation}
        onCancelSuccess={handleCancelSuccess}
        isTicketActive={!!tickets.find((t) => t.id === infoTicket?.id)}
      />
    </>
  );
}

// 상태 박스 스타일 함수
const getStatusBoxStyle = (statusBoxText: string) => {
  let backgroundColor = '#FFF';
  let textColor = '#222';
  if (statusBoxText === '인증완료') {
    backgroundColor = '#DCFCE7';
    textColor = '#16A34A';
  } else if (statusBoxText === '인증필요' || statusBoxText === '예매완료' || statusBoxText === '등록필요') {
    backgroundColor = '#FFF9D6';
    textColor = '#C59A18';
  }
  return {
    box: {
      backgroundColor,
      borderRadius: 9999,
      minWidth: 60,
      minHeight: 20,
      paddingHorizontal: 8,
      paddingVertical: 2,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginRight: 0,
      marginLeft: 70,
      alignSelf: 'flex-end' as const,
      marginTop: 1,
    },
    text: {
      color: textColor,
      fontSize: 12,
      fontWeight: 400 as const,
      lineHeight: 16,
      fontFamily: 'Roboto',
      textAlign: 'center' as const,
    },
  };
};

const styles = StyleSheet.create({
  customHeader: {
    width: "100%",
    height: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ef4444",
    justifyContent: "center",
  },
  customHeaderText: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: "Pacifico-Regular",
    color: "#fff",
    textAlign: "left",
  },
  container: { flex: 1, backgroundColor: "#f9fafb" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 16,
    width: 343,
    alignSelf: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  filterRow: { flexDirection: "row" },
  filterButton: {
    backgroundColor: "#f2f4f5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
  },
  filterButtonActive: { backgroundColor: "#e43d3d" },
  filterButtonText: { color: "#4a5462", fontSize: 15, fontWeight: "500" },
  filterButtonTextActive: { color: "#fff" },
  listContainer: { paddingBottom: 32, alignItems: "center" },
  card: {
    width: 343,
    height: 136,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    paddingTop: 12,
    paddingBottom: 13,
    paddingLeft: 12,
    paddingRight: 12,
  },
  marginWrap: {
    paddingRight: 12,
    flexDirection: "row",
  },
  blankImage: {
    width: 80,
    height: 96,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginTop: 0,
    marginBottom: 0,
    overflow: "hidden",
  },
  cardContent: {
    width: 225,
    height: 109,
    justifyContent: "flex-start",
    paddingTop: 0,
    paddingLeft: 0,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 21,
    width: 225,
    marginBottom: 0,
  },
  h324: {
    width: 117,
    height: 21,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    fontFamily: "Roboto-Bold",
    color: "#000",
    textAlign: "left",
  },
  statusBadge: {
    width: 60,
    borderRadius: 9999,
    backgroundColor: "#dcfce7",
    height: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontFamily: "Roboto-Regular",
    lineHeight: 16,
    fontSize: 12,
    textAlign: "left",
  },
  marginWrap1: {
    paddingTop: 4,
    flexDirection: "row",
  },
  p30: {
    height: 16,
    width: 225,
    flexDirection: "row",
    alignItems: "center",
  },
  cardInfo: {
    color: "#4b5563",
    fontFamily: "Roboto-Regular",
    lineHeight: 16,
    fontSize: 12,
    textAlign: "left",
  },
  marginWrap3: {
    paddingTop: 8,
    flexDirection: "row",
  },
  div39: {
    height: 24,
    width: 225,
    flexDirection: "row",
  },
  showqrcode140: {
    width: 87,
    backgroundColor: "#e53e3e",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  qr42: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontSize: 11,
    lineHeight: 14,
  },
  marginWrap4: {
    paddingLeft: 8,
    flexDirection: "row",
  },
  showdetails143: {
    width: 68,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  text3: {
    color: "#4b5563",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    lineHeight: 16,
    fontSize: 12,
  },
  statusGreen: {
    color: "#16a34a",
  },
  statusYellow: {
    color: "#eab308",
  },
  statusBgGreen: {
    backgroundColor: "#dcfce7",
  },
  statusBgYellow: {
    backgroundColor: "#fef9c2",
  },
});
