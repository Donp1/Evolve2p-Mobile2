import { colors } from "@/constants";
import React, { useRef, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  StyleSheet,
  Text,
  Pressable,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ImageSourcePropType,
} from "react-native";
import { ms } from "react-native-size-matters";
import Entypo from "@expo/vector-icons/Entypo";

const { width } = Dimensions.get("window");

interface DataProps {
  id: number;
  image: ImageSourcePropType | undefined;
  heading: string;
  description: string;
}

export default function StoryBox() {
  const [data, setData] = useState<DataProps[]>([
    {
      heading: "Increase Buy/Sell Limits",
      description: "Unlock higher trading limits by upgrading verification.",
      id: 1,
      image: require("@/assets/images/type-limits.png"),
    },
    {
      heading: "Enable 2FA Security",
      description:
        "Protect your account and withdrawals with two-factor authentication.",
      id: 2,
      image: require("@/assets/images/type-2fa.png"),
    },
  ]);

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleClose = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Horizontal ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 10 }}
      >
        {data.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.heading}>{item.heading}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>

            <Pressable
              onPress={() => handleClose(item.id)}
              style={styles.closeButton}
            >
              <Entypo name="cross" size={15} color="white" />
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {data.map((_, i) => {
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
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#3A3A3A",
    borderRadius: 10,
    position: "relative",
  },
  image: {
    width: ms(50),
    height: ms(50),
    borderRadius: 5,
  },
  heading: {
    fontSize: ms(14),
    fontWeight: "500",
    color: colors.white2,
  },
  description: {
    fontSize: ms(12),
    fontWeight: "400",
    color: colors.secondary,
  },
  closeButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gray2,
    position: "absolute",
    top: 2,
    right: 2,
    zIndex: 10,
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
