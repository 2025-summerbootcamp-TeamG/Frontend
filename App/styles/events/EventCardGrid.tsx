import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import EventCard, { Event } from "../../components/events/EventCard_home";
import { useNavigation } from "@react-navigation/native";

interface Props {
  title: string;
  events: Event[];
  type: "popular" | "new";
}

export default function EventCardGrid({ title, events, type }: Props) {
  const navigation = useNavigation();

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity
          onPress={() =>
            (navigation as any).navigate("홈" as never, {
              screen: type === "popular" ? "PopularEvents" : "NewEvents",
            })
          }
        >
          <View style={styles.moreRow}>
            <Text style={styles.moreText}>더보기</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        {events.map((event: Event, idx) => (
          <EventCard key={event.id || idx} event={event} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    fontFamily: "Roboto",
    lineHeight: 28,
  },
  moreRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreText: {
    color: "#E53E3E",
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "400",
    lineHeight: 20,
  },
  grid: {
    width: 343,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});
