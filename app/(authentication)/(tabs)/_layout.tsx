import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { colors } from "@/constants";
import TabBar from "@/components/TabBar";

const TabLayout = () => {
  return (
    <Tabs tabBar={(props: any) => <TabBar {...props} />} screenOptions={{}}>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="trades"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

const styles = StyleSheet.create({});
