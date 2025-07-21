import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, Text } from "react-native";
import EventCard from "../../components/events/EventCard_home";
import { getEvents } from "../../services/EventService";
import { Event } from "../../services/Types";
import { useNavigation } from "@react-navigation/native";

export default function NewEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();
  const limit = 20;

  const fetchEvents = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await getEvents({ page, limit });
      setEvents((prev) => {
        const combined = page === 1 ? res.events : [...prev, ...res.events];
        return [...combined].sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA;
        });
      });
      if (res.events.length < limit) setHasMore(false);
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
      renderItem={renderItem}
      onEndReached={fetchEvents}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? (
          <View style={{ padding: 16 }}>
            <Text>로딩중...</Text>
          </View>
        ) : null
      }
      contentContainerStyle={{ padding: 16, backgroundColor: "#fff" }}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "flex-start", gap: 12 }}
    />
  );
}
