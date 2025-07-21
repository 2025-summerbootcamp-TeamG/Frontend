// App/pages/events/PopularEventsPage.tsx
import React, { useEffect, useState, useCallback } from "react";
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

  const fetchEvents = useCallback(async () => {
    if (loading || !hasMore) return; //이미 로딩중이거나 더 불러올게 없으면 중단
    setLoading(true);
    try {
      const res = await getEvents({ page, limit }); //api 호출
      const sorted = [...res.events].sort(
        (a, b) => b.view_count - a.view_count //인기순
      );
      setEvents((prev) => (page === 1 ? sorted : [...prev, ...sorted]));
      if (res.events.length < limit) setHasMore(false); // 받은 데이터가 limit값보다 적으면 마지막 페이지
      setPage((prev) => prev + 1);
    } catch {
      setHasMore(false);
    }
    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({ item }: { item: Event }) => (
    <EventCard event={item} navigation={navigation} />
  );

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem} // 각 이벤트 카드 렌더링
      onEndReached={fetchEvents} // 스크롤이 끝에 닿으면 fetchEvents호출
      onEndReachedThreshold={0.5} //50%지점에서 미리 호출
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
