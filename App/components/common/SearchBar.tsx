import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, NativeSyntheticEvent, TextInputSubmitEditingEventData } from "react-native";
import SearchIcon from "../../assets/events/SearchIcon.svg";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: (text: string) => void;
};

const SearchBar = ({ value, onChangeText, onSearch }: Props) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="공연, 콘서트, 아티스트를 검색하세요."
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={(e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => onSearch(e.nativeEvent.text)}
        returnKeyType="search"
      />
      <TouchableOpacity onPress={() => onSearch(value)}>
      <SearchIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 360,
    height: 47,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 17,
    paddingRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "500",
    color: "#111827",
    paddingVertical: 0,
  },
  icon: {
    marginLeft: 8,
  },
});

export default SearchBar;
