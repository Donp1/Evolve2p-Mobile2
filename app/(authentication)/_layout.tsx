import { Alert, AppState, AppStateStatus, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, Stack } from "expo-router";
import {
  getUser,
  registerForPushNotificationsAsync,
  useUserPolling,
} from "@/utils/countryStore";
import { useUserStore } from "@/store/userStore";
import {
  Notification,
  useCoinPriceStore,
  useNotificationStore,
} from "@/context";
import { io } from "socket.io-client";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { useAlert } from "@/components/AlertService";
import { colors } from "@/constants";

const AuthLayout = () => {
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const { showAlert, AlertComponent } = useAlert();
  const hasShownAlert = useRef(false);

  useEffect(() => {
    if (!user?.id) return;
    const socket = io("https://evolve2p-backend.onrender.com", {
      query: { userId: user?.id },
    });

    socket.on("receive_coin", async (data) => {
      const newUser = await getUser();
      setUser(newUser?.user);
    });

    return () => {
      socket.off("receive_coin", async (data) => {
        const newUser = await getUser();
        setUser(newUser);
      });

      socket.disconnect();
    };
  }, [user?.id]);

  return (
    <>
      {AlertComponent}
      <Stack screenOptions={{ animation: "flip" }}>
        <Stack.Screen name="securityPin" options={{ headerShown: false }} />
        <Stack.Screen name="kycVerification" options={{ headerShown: false }} />
        <Stack.Screen name="notification" options={{ headerShown: false }} />
        <Stack.Screen
          name="transaction-limit"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="two-factor-auth" options={{ headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
        <Stack.Screen name="change-password" options={{ headerShown: false }} />
        <Stack.Screen name="change-pin" options={{ headerShown: false }} />
        <Stack.Screen name="about-us" options={{ headerShown: false }} />
        <Stack.Screen name="language" options={{ headerShown: false }} />
        <Stack.Screen name="kyc-completed" options={{ headerShown: false }} />
        <Stack.Screen name="receive-crypto" options={{ headerShown: false }} />
        <Stack.Screen name="send-crypto" options={{ headerShown: false }} />
        <Stack.Screen name="swap" options={{ headerShown: false }} />
        <Stack.Screen name="create-offer" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen
          name="account-verification"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="chat_view/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="trade/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="process-trade/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({});
