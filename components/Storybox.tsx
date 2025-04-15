import { colors } from "@/constants";
import { FontAwesome } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Image,
  Dimensions,
  Animated,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import { ms } from "react-native-size-matters";
import Entypo from "@expo/vector-icons/Entypo";

const { width } = Dimensions.get("window");
interface dataProps {
  id: number;
  image: string;
  heading: string;
  description: string;
}

export default function StoryBox() {
  const [data, setData] = useState<dataProps[]>([
    {
      heading: " Increase Buy/Sell Limits",
      description: "Unlock higher trading limits by upgrading verification.",
      id: 1,
      image: "https://dummyimage.com/300",
    },
    {
      heading: " Increase Buy/Sell Limits",
      description: "Unlock higher trading limits by upgrading verification.",
      id: 2,
      image: "https://dummyimage.com/300",
    },
  ]);

  const scrollX = useRef(new Animated.Value(0)).current;

  const handleClose = (id: number) => {
    setData((prev) =>
      prev.filter((item) => {
        console.log(item.id, id, item.id !== id);
        return item.id !== id;
      })
    );
  };

  return (
    <View style={styles.container}>
      {/* Carousel */}
      <FlatList
        data={data}
        contentContainerStyle={{
          gap: 10,
        }}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: 500,
                  color: colors.white2,
                }}
              >
                {item.heading}
              </Text>
              <Text
                style={{
                  fontSize: ms(12),
                  fontWeight: 400,
                  color: colors.secondary,
                }}
              >
                {item.description}
              </Text>
            </View>

            <Pressable
              onPress={() => handleClose(item.id)}
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: colors.gray2,
                position: "absolute",
                top: 2,
                right: 2,
                zIndex: 100,
              }}
            >
              <Entypo name="cross" size={15} color="white" />
            </Pressable>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {data.map((_: any, i: number) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.gray2,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray2,
  },
  itemContainer: {
    width: width - 40,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#3A3A3A",
    borderRadius: 10,
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: ms(50),
    height: ms(50),
    borderRadius: 5,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#333",
    marginHorizontal: 4,
  },
});
