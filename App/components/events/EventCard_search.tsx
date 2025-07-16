import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Event } from "./EventCard_home";

export default function EventCardSearch({
  event,
  onPress,
}: {
  event: Event;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View style={styles.card}>
        <Image source={{ uri: event.image_url }} style={styles.image} />
        <View style={styles.infoWrap}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {event.artist}
            </Text>
            <View
              style={[
                styles.badge,
                event.status === "마감임박" || event.status === "인기"
                  ? styles.badgeHot
                  : styles.badgeNormal,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  event.status === "마감임박" || event.status === "인기"
                    ? styles.badgeTextHot
                    : styles.badgeTextNormal,
                ]}
              >
                {event.status}
              </Text>
            </View>
          </View>
          <Text style={styles.desc} numberOfLines={1}>
            {event.date} {event.location}
          </Text>
          <Text style={styles.price}>₩{event.price.toLocaleString()}</Text>
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
    backgroundColor: "#FEE2E2", // 연한 빨간색
  },
  badgeNormal: {
    backgroundColor: "#E5E7EB",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  badgeTextHot: {
    color: "#E53E3E", // 진한 빨간색
  },
  badgeTextNormal: {
    color: "#6B7280",
  },
});
