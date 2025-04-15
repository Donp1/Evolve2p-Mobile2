import { homeContent } from "@/app/(authentication)/(tabs)/home";
import { colors } from "@/constants";
import React from "react";
import { FlatList, View, Text, StyleSheet, Dimensions } from "react-native";
import { ms } from "react-native-size-matters";

const data = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);

interface pageProps {
  data: homeContent[];
}
export default function GridComponent({ data }: pageProps) {
  return (
    <FlatList
      data={data}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.item}>
          {item.icon}
          <Text
            style={{
              fontWeight: 400,
              fontSize: ms(14),
              color: colors.white2,
              marginTop: 20,
            }}
          >
            {item.heading}
          </Text>
          <Text
            style={{ fontWeight: 500, fontSize: ms(12), color: colors.white }}
          >
            {item.description}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
  },
  row: {
    gap: 10,
  },
  item: {
    backgroundColor: "#222222",
    borderRadius: 8,
    height: "auto",
    width: (Dimensions.get("window").width - 50) / 2, // 2 columns with margin
    marginBottom: 10,
    padding: 10,
  },
  text: {
    fontSize: 16,
  },
});
