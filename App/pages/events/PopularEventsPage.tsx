// App/pages/events/PopularEventsPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { View, FlatList, Text } from "react-native";
import EventCard from "../../components/events/EventCard_home";
import { getEvents } from "../../services/EventService";
import { Event } from "../../services/Types";
import { useNavigation } from "@react-navigation/native";

export default function PopularEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();
  const limit = 20;
  const onEndReachedCalledDuringMomentum = useRef(false);

  // 항상 명시적으로 page를 넘겨서 호출
  const fetchEvents = async (fetchPage: number) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      // sort: 'popular' 파라미터 추가
      const res = await getEvents({ page: fetchPage, limit, sort: "popular" });
      setEvents((prev) => {
        const combined =
          fetchPage === 1 ? res.events : [...prev, ...res.events];
        // id로 중복 제거
        const unique = Array.from(
          new Map(combined.map((e) => [e.id, e])).values()
        );
        // 인기순 정렬, 조회수 같으면 id 내림차순
        return unique.sort((a, b) => {
          if (b.view_count !== a.view_count) {
            return b.view_count - a.view_count;
          }
          return b.id - a.id;
        });
      });
      if (res.events.length < limit) setHasMore(false);
      setPage(fetchPage);
    } catch {
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents(1); // 첫 마운트 시 1페이지만 호출
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({ item }: { item: Event }) => (
    <EventCard event={item} navigation={navigation} />
  );

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      onEndReached={() => {
        if (!onEndReachedCalledDuringMomentum.current && hasMore && !loading) {
          fetchEvents(page + 1);
          onEndReachedCalledDuringMomentum.current = true;
        }
      }}
      onMomentumScrollBegin={() => {
        onEndReachedCalledDuringMomentum.current = false;
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? (
          <View style={{ padding: 16 }}>
            <Text>로딩중...</Text>
          </View>
        ) : null
      }
      contentContainerStyle={{ padding: 16, backgroundColor: "#fff" }}
      numColumns={2} //2열
      columnWrapperStyle={{ justifyContent: "flex-start", gap: 12 }}
    />
  );
}
