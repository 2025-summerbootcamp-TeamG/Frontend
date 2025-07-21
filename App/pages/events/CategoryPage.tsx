import React, { useEffect, useState } from "react";
import { View } from "react-native";
import EventCardGrid from "../../styles/events/EventCardGrid";
import { getEventsByGenre } from "../../services/EventService";
import { Event } from "../../components/events/EventCard_home";

export default function CategoryPage({ route }: any) {
  const { categoryName } = route.params;
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    getEventsByGenre(categoryName)
      .then((res) => {
        // 백엔드 데이터에서 image_url을 thumbnail로 매핑
        const mapped = res.events.map((e: any) => ({
          ...e,
          thumbnail: e.thumbnail || e.image_url || "", // image_url이 있으면 thumbnail로 사용
        }));
        setEvents(mapped);
      })
      .catch(() => setEvents([]));
  }, [categoryName]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <EventCardGrid
        title={`${categoryName} 전체 티켓`}
        events={events}
        type="popular"
        hideMoreButton={true}
      />
    </View>
  );
}
