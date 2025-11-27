import "expo-dev-client";
import { colors } from "@/constants";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getItemAsync } from "expo-secure-store";
import { checkToken } from "@/utils/countryStore";
import { Platform, View, StatusBar as RNStatusBar } from "react-native";
import { useCoinPriceStore } from "@/context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NotificationProvider } from "@/context/NotificationContext";
import * as Notifications from "expo-notifications";

SplashScreen.hide();

export default function RootLayoutNav() {
  const queryClient = new QueryClient();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  useEffect(() => {
    (async () => {
      const authToken = await getItemAsync("authToken");

      if (authToken) {
        router.replace("/(authentication)/securityPin");
      }
    })();
  }, []);

  return (
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar
          // backgroundColor="transparent"
          translucent
          animated
          style="light"
        />
        <Stack screenOptions={{ animation: "fade" }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="forgotPin" options={{ headerShown: false }} />
          <Stack.Screen name="resetPassword" options={{ headerShown: false }} />
          <Stack.Screen
            name="(authentication)"
            options={{ headerShown: false }}
          />
        </Stack>
      </QueryClientProvider>
    </NotificationProvider>
  );
}
