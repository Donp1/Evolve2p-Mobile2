import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "@/constants";
import { Image } from "expo-image";
import { ms, s, vs } from "react-native-size-matters";

const SplashScreen = () => {
  const logo = require("@/assets/images/Logo.png");
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.image} contentFit="contain" />
      <Text style={styles.text}>Trade Crypto Securely & Seamlessly!</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: s(150),
    height: vs(150),
  },
  text: {
    fontSize: ms(12),
    textTransform: "uppercase",
    fontWeight: 600,
    color: colors.secondary,
    position: "absolute",
    bottom: vs(30),
    lineHeight: 20,
    letterSpacing: -0.5,
    textAlign: "center",
  },
});
