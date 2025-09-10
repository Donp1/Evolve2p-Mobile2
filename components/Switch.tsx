import { colors } from "@/constants";
import React, { Dispatch, SetStateAction, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { ms, s, vs } from "react-native-size-matters";

interface pageProps {
  isEnabled: boolean;
  setIsEnabled: Dispatch<SetStateAction<boolean>>;
}

const Switch = ({ isEnabled, setIsEnabled }: pageProps) => {
  const toggleSwitch = () => setIsEnabled((prev) => !prev);

  return (
    <Pressable
      onPress={toggleSwitch}
      style={[
        styles.container,
        isEnabled
          ? { backgroundColor: colors.accent, alignItems: "flex-end" }
          : { backgroundColor: colors.gray, alignItems: "flex-start" },
      ]}
    >
      <View
        style={[
          styles.indicator,
          isEnabled
            ? { backgroundColor: "black" }
            : { backgroundColor: colors.white2 },
        ]}
      ></View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: s(42),
    height: vs(24),
    justifyContent: "center",
    borderRadius: 32,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  indicator: {
    width: 16,
    height: 16,
    borderRadius: 16 / 2,
  },
});

export default Switch;
