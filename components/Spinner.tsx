import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { colors } from "@/constants";

const Spinner = ({ width, height }: { width: number; height: number }) => {
  const rotation = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.get()}deg` }],
    };
  }, [rotation.value]);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1
    );
    return () => {
      rotation.value = 0;
    };
  }, []);
  return (
    <Animated.View
      style={[styles.spinner, animatedStyles, { width, height }]}
    />
  );
};

export default Spinner;

const styles = StyleSheet.create({
  spinner: {
    borderRadius: 20,
    borderWidth: 3,
    borderTopColor: colors.gray2,
    borderRightColor: colors.gray2,
    borderBottomColor: colors.gray2,
    borderLeftColor: "green",
  },
});
