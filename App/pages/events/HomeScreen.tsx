import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import MainHeader from "../../components/common/MainHeader";
import SearchBar from "../../components/common/SearchBar";
import CategoryList from "../../components/events/CategoryList";
import EventCardGrid from "../../styles/events/EventCardGrid";
import { events } from "../../assets/events/EventsMock";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text: string) => {
    if (text.trim()) {
      navigation.navigate("SearchPage", { query: text.trim() });
      setSearchText(""); // 검색 후 입력창 비우기(선택)
    }
  };

  const popularEvents = events.filter((e) => e.type === "popular");
  const newEvents = events.filter((e) => e.type === "new");
  return (
    <>
      <MainHeader />
      <ScrollView
        style={{ backgroundColor: "#fff" }}
        stickyHeaderIndices={[0]}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={{ padding: 16, backgroundColor: "#fff" }}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            onSearch={handleSearch}
          />
        </View>
        <CategoryList navigation={navigation} />
        <View style={{ padding: 16 }}>
          <EventCardGrid
            title="인기 티켓"
            events={popularEvents}
            type="popular"
          />
          <EventCardGrid title="신규 티켓" events={newEvents} type="new" />
        </View>
      </ScrollView>
    </>
  );
}
