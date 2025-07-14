import React from "react";
import { View, Text, StyleSheet } from "react-native";
import EventCard, { Event } from "../../components/events/EventCard_home";
import { events } from "../../assets/events/EventsMock";

interface Props {
  title: string;
  events: Event[];
}

export default function EventCardGrid({ title, events }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.moreRow}>
          <Text style={styles.moreText}>더보기</Text>
        </View>
      </View>
      <View style={styles.grid}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
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
