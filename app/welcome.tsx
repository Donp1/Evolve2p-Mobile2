import {
  Pressable,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, contents } from "@/constants";
import { ms, s, vs } from "react-native-size-matters";
import { Image } from "expo-image";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/utils/globalStyles";

const Welcome = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => {
        if (!(current >= contents.length - 1)) return current + 1;
        return 0;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.primary }}
      >
        <View style={styles.top}>
          <View style={styles.indicatorContainer}>
            {contents.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  activeIndex === index && {
                    backgroundColor: colors.secondary,
                  },
                ]}
              />
            ))}
          </View>
          <>
            {contents.map(
              (item, index) =>
                activeIndex === index && (
                  <View style={styles.topContainer} key={index}>
                    <Text style={styles.topHeading}>{item.heading}</Text>
                    <Text style={styles.topText}>{item.text}</Text>
                  </View>
                )
            )}
          </>
        </View>
        <View style={styles.middle}>
          {contents.map(
            (item, index) =>
              activeIndex === index && (
                <Image
                  key={index}
                  source={item.image}
                  style={{ flex: 0.8 }}
                  contentFit="contain"
                  priority={"high"}
                />
              )
          )}
        </View>
        <View style={styles.bottom}>
          <Pressable
            onPress={() => router.push("/login")}
            style={[styles.btn, { backgroundColor: colors.gray2 }]}
          >
            <Text style={[styles.btnText, { color: colors.secondary }]}>
              Log in
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/register")}
            style={[styles.btn, { backgroundColor: "#4DF2BE" }]}
          >
            <Text style={styles.btnText}>Create account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  btn: {
    width: s(158),
    height: 48,
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: s(2),
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  top: {
    width: "100%",
    height: "auto",
    paddingBottom: vs(20),
  },
  topContainer: {
    paddingHorizontal: s(15),
    paddingTop: vs(20),
    display: "flex",
    gap: ms(25),
  },
  topHeading: {
    color: colors.secondary,
    fontWeight: 700,
    fontSize: s(30),
    lineHeight: 44,
    letterSpacing: 2,
  },
  topText: {
    color: colors.secondary,
    fontWeight: "400",
    fontSize: s(16),
    lineHeight: 24,
    letterSpacing: 0,
  },

  indicatorContainer: {
    display: "flex",
    alignItems: "center",
    gap: s(15),
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: "100%",
  },
  indicator: {
    flex: 1,
    height: 4,
    backgroundColor: colors.gray,
    borderRadius: 8,
  },

  middle: {
    flex: 1,
    padding: 30,
  },
  bottom: {
    width: "100%",
    height: "15%",
    display: "flex",
    alignItems: "center",
    gap: 20,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});
