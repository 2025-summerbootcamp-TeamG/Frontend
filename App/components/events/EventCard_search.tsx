import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Event } from "./EventCard_home";

export default function EventCardSearch({
  event,
  onPress,
}: {
  event: any; // API 응답에 맞게 any로
  onPress?: () => void;
}) {
  // 이미지 URL 우선순위: thumbnail > image_url
  const imageUrl = event.thumbnail || event.image_url;

  // 가격: 문자열이면 그대로, 숫자면 포맷팅
  let priceText = "";
  if (typeof event.price === "string") {
    priceText = event.price;
  } else if (typeof event.price === "number") {
    priceText = `₩${event.price.toLocaleString()}`;
  }

  // 상태: 예약가능/마감임박/인기 등
  const status = event.status || event.reservation_status || "예약가능";
  const isHot = status === "마감임박" || status === "인기";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View style={styles.card}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.infoWrap}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {event.name}
            </Text>
            <View style={[styles.badge, isHot ? styles.badgeHot : styles.badgeNormal]}>
              <Text style={[styles.badgeText, isHot ? styles.badgeTextHot : styles.badgeTextNormal]}>
                {status}
              </Text>
            </View>
          </View>
          <Text style={styles.desc} numberOfLines={1}>
            {event.date} {event.location}
          </Text>
          <Text style={styles.price}>{priceText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 16,
    padding: 12,
    minHeight: 90,
  },
  image: {
    width: 100,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
    resizeMode: "cover",
    backgroundColor: "#eee",
  },
  infoWrap: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    flex: 1,
    marginRight: 8,
  },
  desc: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    color: "#E53E3E",
    fontWeight: "bold",
  },
  badge: {
    minWidth: 60,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#E5E7EB",
  },
  badgeHot: {
    backgroundColor: "#FEE2E2",
  },
  badgeNormal: {
    backgroundColor: "#E5E7EB",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  badgeTextHot: {
    color: "#E53E3E",
  },
  badgeTextNormal: {
    color: "#6B7280",
  },
});