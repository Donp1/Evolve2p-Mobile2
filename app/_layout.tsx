import "expo-dev-client";
import { colors } from "@/constants";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getItemAsync } from "expo-secure-store";
import { checkToken } from "@/utils/countryStore";

SplashScreen.hide();

export default function RootLayoutNav() {
  const queryClient = new QueryClient();

  const [token, setToken] = useState<string | null>(null);
  const [expired, setExpired] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const authToken = await getItemAsync("authToken");
        if (authToken) {
          const res = await checkToken(JSON.parse(authToken).token);
          if (res?.error) {
            setExpired(true);
            return;
          }
          if (res?.success) {
            setExpired(false);
            setToken(authToken);
          }
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (token && !expired) {
      router.replace("/(authentication)/securityPin");
    }
  }, [token]);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar backgroundColor={colors.gray2} animated style="light" />
      <Stack
        screenOptions={{
          animation: "ios_from_left",
          animationDuration: 100,
        }}
      >
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
  );
}
