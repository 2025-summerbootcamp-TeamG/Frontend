import React from "react";
import { ScrollView, View } from "react-native";
import SearchBar from "../../components/common/SearchBar";
import CategoryList from "../../components/common/CategoryList";
import EventCardGrid from "../../styles/events/EventCardGrid";
import { events } from "../../assets/events/EventsMock";

export default function HomeScreen() {
  const popularEvents = events.filter((e) => e.type === "popular");
  const newEvents = events.filter((e) => e.type === "new");
  return (
    <ScrollView
      style={{ backgroundColor: "#fff" }}
      stickyHeaderIndices={[0]}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View style={{ padding: 16, backgroundColor: "#fff" }}>
        <SearchBar />
      </View>
      <CategoryList />
      <View style={{ padding: 16 }}>
        <EventCardGrid title="인기 티켓" events={popularEvents} />
        <EventCardGrid title="신규 티켓" events={newEvents} />
      </View>
    </ScrollView>
  );
}
