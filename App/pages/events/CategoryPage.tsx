import React from "react";
import { View } from "react-native";
import { events } from "../../assets/events/EventsMock";
import EventCardGrid from "../../styles/events/EventCardGrid";

export default function CategoryPage({ route }: any) {
  const { categoryName } = route.params;
  // 카테고리명(콘서트, 뮤지컬 등)이 artist명에 포함되어 있는지로 필터링 (임시)
  const filteredEvents = events.filter((e) => e.artist.includes(categoryName));
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <EventCardGrid
        title={`${categoryName} 전체 티켓`}
        events={filteredEvents}
        type="popular"
        hideMoreButton={true}
      />
    </View>
  );
}
