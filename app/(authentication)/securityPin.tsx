import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ms, s } from "react-native-size-matters";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Link, router } from "expo-router";

import { colors } from "@/constants";
import { globalStyles } from "@/utils/globalStyles";
import CreateContainer from "@/components/createAccount/CreateContainer";
import Spinner from "@/components/Spinner";
import CustomeOtp from "@/components/CustomeOtp";
import { useAlert } from "@/components/AlertService";
import { checkPin, getUser } from "@/utils/countryStore";
import { deleteItemAsync } from "expo-secure-store";
import { useUserStore } from "@/store/userStore";
import { useNotificationStore } from "@/context";

const SecurityPin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { showAlert, AlertComponent } = useAlert();
  const setUser = useUserStore((state: any) => state.setUser);
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications
  );

  // useEffect(() => {
  //   (async () => {
  //     await deleteItemAsync("authToken");
  //     router.replace("/login");
  //   })();
  // }, []);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/login");
    }
  }, []);

  const handleOtp = useCallback(
    async (pin: string) => {
      setIsLoading(true);
      try {
        const res = await checkPin(pin);

        if (res?.error) {
          if (String(res?.message).includes("Token has expired")) {
            await deleteItemAsync("authToken"); // optional cleanup
            showAlert(
              "Error",
              "Session Expired please login.",
              [{ text: "Login", onPress: () => router.replace("/login") }],
              "error"
            );

            return;
          } else {
            showAlert(
              "Error",
              res?.message || "An error occurred while checking your PIN.",
              [{ text: "Ok", onPress() {} }],
              "error"
            );

            return;
          }
        }

        const userRes = await getUser();
        if (res?.success && userRes?.success) {
          setUser(userRes.user);
          setNotifications(userRes.user?.notifications || []);
          router.push("/(authentication)/(tabs)/home");
        }
      } catch (error) {
        console.error("PIN verification failed:", error);
        showAlert(
          "Error",
          "Something went wrong. Please try again.",
          [{ text: "OK", onPress() {} }],
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, setNotifications, showAlert]
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      {AlertComponent}

      <View style={globalStyles.topBar}>
        <Pressable onPress={goBack} style={styles.backButton}>
          <FontAwesome name="chevron-left" color={colors.secondary} size={15} />
        </Pressable>
      </View>

      <CreateContainer
        heading="Enter security PIN"
        text="Your PIN helps you log in faster and approve transactions securely."
      >
        <View style={[globalStyles.form, styles.form]}>
          <View style={styles.otpWrapper}>
            <CustomeOtp handleOtp={handleOtp} numberofDigits={4} />
          </View>
        </View>

        {isLoading && (
          <View style={styles.loader}>
            <Spinner width={40} height={40} />
          </View>
        )}

        <View style={globalStyles.bottomContainer}>
          <View style={styles.forgotWrapper}>
            <Link href="/forgotPin">
              <Text style={styles.forgotText}>Forgot Pin</Text>
            </Link>
          </View>
        </View>
      </CreateContainer>
    </SafeAreaView>
  );
};

export default SecurityPin;

const styles = StyleSheet.create({
  backButton: {
    padding: 15,
  },
  form: {
    paddingTop: 20,
  },
  otpWrapper: {
    paddingHorizontal: s(30),
  },
  loader: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  forgotWrapper: {
    marginBottom: 20,
  },
  forgotText: {
    fontWeight: "700", // must be string for RN compatibility
    color: colors.white2,
    fontSize: ms(14),
  },
});
