import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const categories = [
  { name: "콘서트", icon: require("../../assets/events/concert.png") },
  { name: "뮤지컬", icon: require("../../assets/events/musical.png") },
  { name: "스포츠", icon: require("../../assets/events/sports.png") },
  { name: "페스티벌", icon: require("../../assets/events/festival.png") },
  { name: "연극", icon: require("../../assets/events/play.png") },
];

export default function CategoryList() {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.row}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.name}
          style={styles.item}
          onPress={() => {
            console.log("pressed", cat.name);
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
