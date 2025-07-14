import React from "react";
import { ScrollView, View, Text, Image, StyleSheet } from "react-native";

const categories = [
  { name: "콘서트", icon: require("../../assets/events/concertIcon.jpg") },
  { name: "뮤지컬", icon: require("../../assets/events/musicalIcon.jpg") },
  { name: "스포츠", icon: require("../../assets/events/sportsIcon.jpg") },
  { name: "페스티벌", icon: require("../../assets/events/festivalIcon.jpg") },
  { name: "연극", icon: require("../../assets/events/playIcon.jpg") },
];

export default function CategoryList() {
  return (
    <View style={styles.outer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollInner}
      >
        {categories.map((cat, idx) => (
          <View key={idx} style={[styles.item, idx !== 0 && styles.itemGap]}>
            <View style={styles.iconWrap}>
              <Image source={cat.icon} style={styles.icon} resizeMode="cover" />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.text}>{cat.name}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: "100%",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  scrollInner: {
    height: 92,
    alignItems: "flex-start",
  },
  item: {
    width: 64,
    height: 76,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  itemGap: {
    marginLeft: 12,
  },
  iconWrap: {
    paddingBottom: 4,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28, // 동그랗게
    backgroundColor: "#eee", // 이미지 없을 때 대비
  },
  textWrap: {
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  text: {
    color: "#111",
    fontSize: 12,
    fontFamily: "Roboto",
    fontWeight: "400",
    lineHeight: 16,
    textAlign: "center",
  },
});
