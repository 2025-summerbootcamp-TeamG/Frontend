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
    console.time("[홈] 행사 API 요청");
    getEvents({ page: 1, limit: 50 })
      .then((res) => {
        console.timeEnd("[홈] 행사 API 요청");
        console.time("[홈] 인기 정렬");
        const sorted = [...res.events].sort(
          (a, b) => Number(b.view_count) - Number(a.view_count)
        );
        const popular = sorted.slice(0, 4);
        console.timeEnd("[홈] 인기 정렬");
        console.time("[홈] 신규 정렬");
        const newList = [...res.events]
          .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
          })
          .slice(0, 4);
        console.timeEnd("[홈] 신규 정렬");
        console.time("[홈] setPopularEvents");
        setPopularEvents(popular);
        console.timeEnd("[홈] setPopularEvents");
        console.time("[홈] setNewEvents");
        setNewEvents(newList);
        console.timeEnd("[홈] setNewEvents");
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

  console.time("[홈] 렌더링");
  const render = (
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
  console.timeEnd("[홈] 렌더링");
  return render;
}
