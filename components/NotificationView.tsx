import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants";
import { router } from "expo-router";

const NotificationView = () => {
  return (
    <Pressable
      onPress={() => router.push("/notifications")}
      style={styles.notiContainer}
    >
      <Ionicons
        style={styles.noti}
        name="notifications"
        size={20}
        color={colors.secondary}
      />
    </Pressable>
  );
};

export default NotificationView;

const styles = StyleSheet.create({
  notiContainer: {
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.white,
  },
  noti: {},
});
