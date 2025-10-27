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

SplashScreen.hide();

export default function RootLayoutNav() {
  const queryClient = new QueryClient();

 
  
  useEffect(() => {
    (async () => {
      const authToken = await getItemAsync("authToken");

       if (authToken){
         router.replace("/(authentication)/securityPin");
       }
        
    })();
  }, []);


  return (
    <QueryClientProvider client={queryClient}>
      {/* {Platform.OS === "android" && (
        <View
          style={{
            height: RNStatusBar.currentHeight,
            backgroundColor: colors.gray2, // your desired background
          }}
        />
      )} */}
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
  );
}
