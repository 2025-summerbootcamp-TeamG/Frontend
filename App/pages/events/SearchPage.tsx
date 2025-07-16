import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { events } from "../../assets/events/EventsMock";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../navigation/HomeStackNavigator";
import SearchBar from "../../components/common/SearchBar";
import EventCardSearch from "../../components/events/EventCard_search";

type SearchPageRoute = { params?: { query?: string } };
export default function SearchPage() {
  const route = useRoute<RouteProp<SearchPageRoute, "params">>();
  const initialQuery = route.params?.query || "";
  const [query, setQuery] = useState(initialQuery);
  const [searchText, setSearchText] = useState(initialQuery);
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  useEffect(() => {
    setQuery(initialQuery);
    setSearchText(initialQuery);
  }, [initialQuery]);

  const filteredEvents = events.filter(
    (e) =>
      e.artist.includes(query) ||
      e.location.includes(query) ||
      e.status.includes(query)
  );

  const handleSearch = () => {
    setQuery(searchText.trim());
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
      {/* 상단 헤더는 Stack.Navigator에서 커스텀 헤더로 처리 */}
      <View style={{ padding: 16, backgroundColor: "#fff" }}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onSearch={() => handleSearch()}
        />
      </View>
      <View style={{ flex: 1, padding: 16 }}>
        {query && filteredEvents.length === 0 ? (
          <View style={styles.noResultWrap}>
            <Text style={styles.noResultText}>검색결과 없음</Text>
          </View>
        ) : (
          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <EventCardSearch
                event={item}
                onPress={() =>
                  navigation.navigate("EventDetail", { eventId: item.id })
                }
              />
            )}
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noResultWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  noResultText: {
    fontSize: 18,
    color: "#9CA3AF",
    fontWeight: "bold",
  },
});
