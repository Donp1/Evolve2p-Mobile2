import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { router, Stack } from "expo-router";
import { getItemAsync } from "expo-secure-store";

const AuthLayout = () => {
  // useEffect(() => {
  //   (async () => {
  //     const token = await getItemAsync("authToken");
  //     if (!token) router.replace("/login");
  //   })();
  // }, []);
  return (
    <Stack
      screenOptions={{
        animation: "ios_from_left",
        animationDuration: 100,
      }}
    >
      <Stack.Screen name="securityPin" options={{ headerShown: false }} />
      <Stack.Screen name="kycVerification" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({});
