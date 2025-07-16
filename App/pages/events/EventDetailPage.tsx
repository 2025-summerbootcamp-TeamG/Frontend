import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  BackHandler, // 추가
  Platform, // 추가
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import LocationIcon from "../../assets/events/locationIcon.svg";
import PriceIcon from "../../assets/events/priceIcon.svg";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { events } from "../../assets/events/EventsMock";

type RootStackParamList = {
  EventDetail: { event: any };
  SeatSelect: { event: any };
};

export default function EventDetailPage() {
  const route = useRoute();
  const { eventId } = route.params as { eventId: number | string };
  const event = events.find((e) => e.id === Number(eventId));
  const screenWidth = Dimensions.get("window").width;
  const imageHeight = (screenWidth * 3) / 4; // 4:3 비율
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  React.useEffect(() => {
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

  if (!event) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>이벤트 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Image
          source={{ uri: event.image_url }}
          style={{ width: "100%", height: imageHeight, borderRadius: 8 }}
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
                {`₩${Number(event.price).toLocaleString()}`}
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
            {typeof (event as any).description === "string" &&
            (event as any).description.length > 0 ? (
              <Text
                style={{
                  color: "#374151",
                  fontSize: 14,
                  fontFamily: "Roboto",
                  lineHeight: 22.75,
                }}
              >
                {(event as any).description}
              </Text>
            ) : (
              <Text style={{ color: "#9CA3AF", fontSize: 14 }}>설명 없음</Text>
            )}
          </View>

          {/* 공연 일정 */}
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
              공연 일정
            </Text>
            {Array.isArray((event as any).schedules) &&
            (event as any).schedules.length > 0 ? (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {(event as any).schedules.map(
                  (schedule: string, idx: number) => (
                    <View
                      key={idx}
                      style={{
                        minWidth: 151,
                        height: 38,
                        paddingHorizontal: 17,
                        paddingVertical: 9,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
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
                        }}
                      >
                        {schedule}
                      </Text>
                    </View>
                  )
                )}
              </View>
            ) : (
              <Text style={{ color: "#9CA3AF", fontSize: 14 }}>
                일정 정보 없음
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
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
            backgroundColor: "#E53E3E",
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("SeatSelect", { event })}
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
    </View>
  );
}
