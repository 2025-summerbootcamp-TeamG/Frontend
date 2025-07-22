import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../navigation/HomeStackNavigator";
import SearchBar from "../../components/common/SearchBar";
import EventCardSearch from "../../components/events/EventCard_search";
import { searchEvents } from "../../services/EventService";

type SearchPageRoute = { params?: { query?: string } };

export default function SearchPage() {
  const route = useRoute<RouteProp<SearchPageRoute, "params">>();
  const initialQuery = route.params?.query || "";
  const [query, setQuery] = useState(initialQuery);
  const [searchText, setSearchText] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  // 검색 실행 함수
  const fetchResults = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchEvents(q.trim());
      setResults(data.events || []);
    } catch (e) {
      setError("검색 중 오류가 발생했습니다.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 최초 진입 시 검색
  useEffect(() => {
    if (initialQuery) fetchResults(initialQuery);
  }, [initialQuery]);

  // 검색 버튼/엔터 시
  const handleSearch = (text: string) => {
    setQuery(text.trim());
    fetchResults(text);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
      <View style={{ padding: 16, backgroundColor: "#fff" }}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onSearch={handleSearch}
        />
      </View>
      <View style={{ flex: 1, padding: 16 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#ef4444" style={{ marginTop: 40 }} />
        ) : error ? (
          <View style={styles.noResultWrap}>
            <Text style={styles.noResultText}>{error}</Text>
          </View>
        ) : query && results.length === 0 ? (
          <View style={styles.noResultWrap}>
            <Text style={styles.noResultText}>검색결과 없음</Text>
          </View>
        ) : (
          <FlatList
            data={results}
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
