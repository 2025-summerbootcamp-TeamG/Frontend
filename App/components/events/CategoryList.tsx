import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const categories = [
  { name: "콘서트", icon: require("../../assets/events/concertIcon.jpg") },
  { name: "뮤지컬", icon: require("../../assets/events/musicalIcon.jpg") },
  { name: "스포츠", icon: require("../../assets/events/sportsIcon.jpg") },
  { name: "페스티벌", icon: require("../../assets/events/festivalIcon.jpg") },
  { name: "연극", icon: require("../../assets/events/playIcon.jpg") },
];

export default function CategoryList({ navigation }: { navigation: any }) {
  return (
    <View style={styles.row}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.name}
          style={styles.item}
          onPress={() => {
            navigation.navigate("CategoryPage", { categoryName: cat.name });
          }}
          activeOpacity={0.7}
        >
          <Image source={cat.icon} style={styles.icon} />
          <Text style={styles.label}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  item: {
    alignItems: "center",
    // marginRight is no longer needed
  },
  icon: { width: 48, height: 48, marginBottom: 4 },
  label: { fontSize: 13, color: "#222", fontWeight: "500" },
});
