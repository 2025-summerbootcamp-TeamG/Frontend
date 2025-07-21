import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Platform,
  Modal,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import LocationIcon from "../../assets/events/locationIcon.svg";
import PriceIcon from "../../assets/events/priceIcon.svg";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getEventDetail } from "../../services/EventService";
import type { RootStackParamList } from "../../navigation/HomeStackNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginModal from "../user/LoginModal";

// 날짜 포맷 변환 함수
function formatEventTime(eventTime: {
  date: string;
  start_time: string;
  end_time: string;
}) {
  const date = new Date(eventTime.date + "T" + eventTime.start_time);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const week = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  const hour = eventTime.start_time.slice(0, 2);
  const minute = eventTime.start_time.slice(3, 5);
  return `${month}월 ${day}일 (${week}) ${hour}:${minute}`;
}

export default function EventDetailPage() {
  const route = useRoute();
  const { eventId } = route.params as { eventId: number | string };
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const screenWidth = Dimensions.get("window").width;
  const IMAGE_HEIGHT = (screenWidth * 3) / 4;
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showAll, setShowAll] = useState(false);
  const [descLines, setDescLines] = useState(0);
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getEventDetail(Number(eventId))
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((e) => {
        setError("이벤트 정보를 불러오지 못했습니다.");
        setLoading(false);
      });
  }, [eventId]);

  useEffect(() => {
    if (Platform.OS === "android") {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          // true를 반환하면 뒤로가기를 막음
          return true;
        }
      );
      return () => backHandler.remove();
    }
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>로딩중...</Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error || "이벤트 정보를 찾을 수 없습니다."}</Text>
      </View>
    );
  }
  //토큰이 존재하는지 여부 확인
  const checkToken = async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem("accessToken");
    return !!token;
  };

  // handleReserve 함수 수정
  const handleReserve = async () => {
    const hasToken = await checkToken();
    if (!hasToken) {
      setLoginModalVisible(true);
      return;
    }
    if (selectedSchedule !== null) {
      navigation.navigate("SeatSelect", {
        event,
        event_time: event.schedules[selectedSchedule],
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <Animated.Image
          source={{ uri: event.image_url }}
          style={{
            width: "100%",
            height: scrollY.interpolate({
              inputRange: [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
              outputRange: [IMAGE_HEIGHT * 2, IMAGE_HEIGHT, IMAGE_HEIGHT],
              extrapolate: "clamp",
            }),
          }}
          resizeMode="cover"
        />

        <View style={{ padding: 16 }}>
          {/* 타이틀/상태 */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  fontFamily: "Roboto",
                  lineHeight: 28,
                  color: "#111",
                }}
              >
                {event.name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#4B5563",
                  fontFamily: "Roboto",
                  lineHeight: 20,
                }}
              >
                {event.date}
              </Text>
            </View>
            <View
              style={{
                minWidth: 49,
                height: 28,
                paddingHorizontal: 12,
                paddingVertical: 4,
                backgroundColor: "#FEE2E2",
                borderRadius: 9999,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#E53E3E",
                  fontSize: 14,
                  fontWeight: "500",
                  fontFamily: "Roboto",
                  lineHeight: 20,
                }}
              >
                {event.status}
              </Text>
            </View>
          </View>

          {/* 장소/가격 */}
          <View style={{ marginBottom: 8 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <LocationIcon width={20} height={20} style={{ marginRight: 8 }} />
              <Text
                style={{ color: "#111", fontSize: 14, fontFamily: "Roboto" }}
              >
                {event.location}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <PriceIcon width={20} height={20} style={{ marginRight: 8 }} />
              <Text
                style={{ color: "#111", fontSize: 14, fontFamily: "Roboto" }}
              >
                {event.price}
              </Text>
            </View>
          </View>

          {/* 공연 정보 */}
          <View style={{ marginTop: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                fontFamily: "Roboto",
                lineHeight: 28,
                marginBottom: 8,
              }}
            >
              공연 정보
            </Text>
            <Text
              style={{
                color: "#374151",
                fontSize: 14,
                fontFamily: "Roboto",
                lineHeight: 22.75,
              }}
              numberOfLines={showAll ? undefined : 5}
              onTextLayout={(e) => setDescLines(e.nativeEvent.lines.length)}
            >
              {event.description}
            </Text>
            {descLines >= 1 && (
              <Text
                style={{
                  color: "#E53E3E",
                  marginTop: 10,
                  fontSize: 30,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                onPress={() => setShowAll((v) => !v)}
              >
                {showAll ? "▴" : "▾"}
              </Text>
            )}
          </View>

          {/* 구분선 */}
          <View
            style={{
              height: 1,
              backgroundColor: "#E5E7EB",
              marginVertical: 15,
            }}
          />

          {/* 공연 일정 */}
          <View style={{ marginTop: 0 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                fontFamily: "Roboto",
                lineHeight: 28,
                marginBottom: 8,
              }}
            >
              공연 일정
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {Array.isArray(event.schedules) && event.schedules.length > 0 ? (
                event.schedules.map((et: any, idx: number) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedSchedule(idx)}
                    activeOpacity={0.8}
                    style={{
                      minWidth: 151,
                      height: 38,
                      paddingHorizontal: 17,
                      paddingVertical: 9,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor:
                        selectedSchedule === idx ? "#E53E3E" : "#E5E7EB",
                      backgroundColor:
                        selectedSchedule === idx ? "#FEE2E2" : "#fff",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "#111",
                        fontSize: 14,
                        fontFamily: "Roboto",
                        textAlign: "center",
                      }}
                    >
                      {formatEventTime(et)}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={{ color: "#9CA3AF", fontSize: 14 }}>
                  일정 정보 없음
                </Text>
              )}
            </View>
          </View>
        </View>
      </Animated.ScrollView>
      {/* 하단 고정 예매하기 버튼 */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#fff",
          padding: 16,
        }}
      >
        <TouchableOpacity
          style={{
            width: "100%",
            height: 45,
            backgroundColor: selectedSchedule !== null ? "#E53E3E" : "#E5E7EB",
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
          disabled={selectedSchedule === null}
          onPress={handleReserve}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: "500",
              fontFamily: "Roboto",
            }}
          >
            예매하기
          </Text>
        </TouchableOpacity>
      </View>
      {/* 로그인 필요 안내 모달 */}
      <Modal visible={loginModalVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 240,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 8 }}>
              안내
            </Text>
            <Text
              style={{
                color: "#4B5563",
                fontSize: 13,
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              로그인이 필요한 서비스입니다. 로그인부터 해주세요.
            </Text>
            <TouchableOpacity
              style={{
                width: 120,
                height: 32,
                backgroundColor: "#E53E3E",
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setLoginModalVisible(false)}
            >
              <Text style={{ color: "white", fontSize: 13, fontWeight: "400" }}>
                확인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
