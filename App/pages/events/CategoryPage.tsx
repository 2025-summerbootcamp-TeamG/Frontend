import React from "react";
import { View } from "react-native";
import { events } from "../../assets/events/EventsMock";
import EventCardGrid from "../../styles/events/EventCardGrid";

export default function CategoryPage({ route }: any) {
  const { categoryName } = route.params;
  // category가 없으면 type으로 필터링
  const filteredEvents = events.filter((e) => e.type === categoryName);
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <EventCardGrid
        title={categoryName}
        events={filteredEvents}
        type="popular"
        hideMoreButton={true}
      />
    </View>
  );
}
