import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import {
  Entypo,
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}
const TabBar = ({ state, descriptors, navigation }: TabBarProps) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Pressable
            // href={buildHref(route.name, route.params)}
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.tabbarItem,
              {
                backgroundColor: isFocused ? colors.gray2 : colors.primary,
              },
              !isFocused && { flex: 0.5 },
            ]}
          >
            {route?.name == "home" && (
              <Feather
                name="home"
                size={ms(20)}
                color={isFocused ? colors.white2 : colors.white}
              />
            )}
            {route?.name == "wallet" && (
              <Ionicons
                name="wallet-outline"
                size={ms(20)}
                color={isFocused ? colors.white2 : colors.white}
              />
            )}
            {route?.name == "market" && (
              <Entypo
                name="shop"
                size={ms(20)}
                color={isFocused ? colors.white2 : colors.white}
              />
            )}
            {route?.name == "trades" && (
              <MaterialIcons
                name="insert-chart-outlined"
                size={ms(20)}
                color={isFocused ? colors.white2 : colors.white}
              />
            )}
            {route?.name == "profile" && (
              <FontAwesome6
                name="user-circle"
                size={ms(20)}
                color={isFocused ? colors.white2 : colors.white}
              />
            )}
            {isFocused && (
              <Text
                style={{
                  color: isFocused ? colors.white2 : colors.white,
                  fontSize: ms(14),
                  lineHeight: ms(20),
                  fontWeight: 500,
                  textAlign: "center",
                  textTransform: "capitalize",
                }}
              >
                {label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 10,
    // gap: 10,
  },

  tabbarItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 48,
    borderCurve: "continuous",
    gap: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
});
