import React from "react";
import { View } from "react-native";
import { events } from "../../assets/events/EventsMock";
import EventCardGrid from "../../styles/events/EventCardGrid";

export default function NewEventsPage() {
  const newEvents = events.filter((e) => e.type === "new");
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <EventCardGrid title="신규 티켓 전체" events={newEvents} type="new" />
    </View>
  );
}
