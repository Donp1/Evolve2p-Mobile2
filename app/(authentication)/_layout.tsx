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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // shouldShowAlert: true, // iOS + Android alert
    shouldPlaySound: true, // play sound
    shouldSetBadge: true, // update app badge
    shouldShowBanner: true, // iOS banner
    shouldShowList: true, // iOS list view
  }),
});

const AuthLayout = () => {
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const { showAlert, AlertComponent } = useAlert();
  const hasShownAlert = useRef(false);

  const addNotification = useNotificationStore(
    (state) => state?.addNotification
  );

  useEffect(() => {
    (async () => {
      const status = await registerForPushNotificationsAsync();
      setIsPermissionGranted(status ?? false);
    })();
  }, [user?.id]);

  // useEffect(() => {
  //   if (isPermissionGranted === false && !hasShownAlert.current) {
  //     hasShownAlert.current = true; // prevent showing again

  //     showAlert(
  //       "Permission Required",
  //       "Please enable notifications to proceed.",
  //       [
  //         {
  //           text: "Grant Permission",
  //           onPress: async () => {
  //             const status = await registerForPushNotificationsAsync();
  //             setIsPermissionGranted(status ?? false);
  //             hasShownAlert.current = false; // reset so it can ask again if still denied
  //           },
  //           style: { backgroundColor: colors.accent },
  //           textStyle: { color: colors.primary },
  //         },
  //         {
  //           text: "Close",
  //           onPress: () => {},
  //         },
  //       ],
  //       "error"
  //     );
  //   }
  // }, [isPermissionGranted]);

  useEffect(() => {
    if (!user?.id) return;
    const socket = io("https://evolve2p-backend.onrender.com", {
      query: { userId: user?.id },
    });

    const handleNewMessage = async (msg: Notification) => {
      if (!isPermissionGranted) {
        showAlert(
          "Permission Required",
          "Please enable notifications to proceed.",
          [{ text: "Close", onPress() {} }],
          "error"
        );
        return;
      }

      addNotification(msg);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: msg.title,
          body: msg.message,
          data: { data: msg.data },
          vibrate: [0, 250, 250, 250],
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
          color: colors.primary,
          sticky: false,
        },

        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
          repeats: false,
        },
      });
    };

    socket.on("new_notification", handleNewMessage);

    return () => {
      socket.off("new_notification", handleNewMessage);
      socket.disconnect();
    };
  }, [user?.id]);

  // re-check when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (state) => {
      if (state === "active") {
        const status = await registerForPushNotificationsAsync();
        setIsPermissionGranted(status ?? false);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // useUserPolling(fetchUserData);

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
