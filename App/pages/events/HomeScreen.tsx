import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import MainHeader from "../../components/common/MainHeader";
import SearchBar from "../../components/common/SearchBar";
import CategoryList from "../../components/events/CategoryList";
import EventCardGrid from "../../styles/events/EventCardGrid";
import { getEvents } from "../../services/EventService";
import { Event } from "../../services/Types";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState("");
  const [popularEvents, setPopularEvents] = useState<Event[]>([]);
  const [newEvents, setNewEvents] = useState<Event[]>([]);

  useEffect(() => {
    getEvents({ page: 1, limit: 50 })
      .then((res) => {
        // 인기: 조회수 내림차순 (Number로 변환)
        const sorted = [...res.events].sort(
          (a, b) => Number(b.view_count) - Number(a.view_count)
        );
        const popular = sorted.slice(0, 4);
        // 신규: created_at 내림차순
        const newList = [...res.events]
          .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
          })
          .slice(0, 4);
        setPopularEvents(popular);
        setNewEvents(newList);
      })
      .catch(() => {
        setPopularEvents([]);
        setNewEvents([]);
      });
  }, []);

  const handleSearch = (text: string) => {
    if (text.trim()) {
      navigation.navigate("SearchPage", { query: text.trim() });
      setSearchText(""); // 검색 후 입력창 비우기(선택)
    }
  };

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
