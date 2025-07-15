import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export type Event = {
  id: number;
  artist: string;
  date: string;
  location: string;
  price: number;
  status: string;
  image_url: string;
  type: string;
};

export default function EventCard({ event }: { event: Event }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => (navigation as any).navigate("EventDetail", { event })}
      activeOpacity={0.8}
    >
      <View style={styles.card}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: event.image_url }} style={styles.image} />
        </View>
        <View style={styles.infoWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {event.artist}
          </Text>
          <Text style={styles.desc} numberOfLines={1}>
            {event.date} - {event.location}
          </Text>
          <View style={styles.bottomRow}>
            <Text style={styles.price}>₩{event.price.toLocaleString()}</Text>
            <View
              style={[
                styles.badge,
                event.status === "인기" && styles.badgeHot,
                event.status === "마감임박" && styles.badgeHot,
                event.status === "예매중" && styles.badgeNormal,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  event.status === "인기" && styles.badgeTextHot,
                  event.status === "마감임박" && styles.badgeTextHot,
                  event.status === "예매중" && styles.badgeTextNormal,
                ]}
              >
                {event.status}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 165.5,
    height: 236,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 12,
  },
  imageWrap: {
    width: 165.5,
    height: 160,
    overflow: "hidden",
  },
  image: {
    width: 165.5,
    height: 160,
    resizeMode: "cover",
  },
  infoWrap: {
    width: 165.5,
    height: 76,
    padding: 8,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    fontFamily: "Roboto",
    lineHeight: 20,
    marginBottom: 0,
  },
  desc: {
    fontSize: 12,
    color: "#4B5563",
    fontFamily: "Roboto",
    lineHeight: 16,
    marginBottom: 0,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 149.5,
    marginTop: 4,
  },
  price: {
    fontSize: 12,
    color: "#E53E3E",
    fontWeight: "600",
    fontFamily: "Roboto",
    lineHeight: 16,
  },
  badge: {
    minWidth: 38,
    height: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  badgeHot: {
    backgroundColor: "#FEE2E2",
  },
  badgeNormal: {
    backgroundColor: "#F3F4F6",
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Roboto",
    lineHeight: 16,
    fontWeight: "400",
  },
  badgeTextHot: {
    color: "#E53E3E",
  },
  badgeTextNormal: {
    color: "#4B5563",
  },
});
