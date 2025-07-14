// App/pages/events/PopularEventsPage.tsx
import React from "react";
import { View } from "react-native";
import { events } from "../../assets/events/EventsMock";
import EventCardGrid from "../../styles/events/EventCardGrid";

export default function PopularEventsPage() {
  const popularEvents = events.filter((e) => e.type === "popular");
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <EventCardGrid
        title="인기 티켓 전체"
        events={popularEvents}
        type="popular"
      />
    </View>
  );
}
