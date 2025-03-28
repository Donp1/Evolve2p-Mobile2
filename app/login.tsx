import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}></View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  topBar: {
    width: "100%",
    height: "auto",
    padding: 20,
    display: "flex",
    alignItems: "center",
    backgroundColor: colors.gray2,
  },
});
