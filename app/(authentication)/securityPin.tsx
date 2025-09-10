import {
  Alert,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "@/constants";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import CreateContainer from "@/components/createAccount/CreateContainer";
import { globalStyles } from "@/utils/globalStyles";
import { ms, s } from "react-native-size-matters";
import Spinner from "@/components/Spinner";
import CustomeOtp from "@/components/CustomeOtp";
import { useAlert } from "@/components/AlertService";
import { checkPin, checkToken, getUser } from "@/utils/countryStore";
import { getItemAsync, deleteItemAsync } from "expo-secure-store";
import { useUserStore } from "@/store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCoinPriceStore, useNotificationStore } from "@/context";

const SecurityPin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { showAlert, AlertComponent } = useAlert();

  const setUser = useUserStore((state: any) => state.setUser);

  const setNotifications = useNotificationStore(
    (state) => state.setNotifications
  );
  const user = useUserStore((state: any) => state.user);

  // useEffect(() => {
  //   (async () => {
  //     await deleteItemAsync("authToken");
  //     router.replace("/login");
  //   })();
  // }, []);

  const goBack = () => {
    if (router.canGoBack()) router.back();
  };

  const handleOtp = async (pin: string) => {
    setIsLoading(true);
    try {
      const res = await checkPin(pin);

      if (res.error) {
        showAlert(
          "Error",
          res?.message || "An error occurred while checking your PIN.",
          [{ text: "OK", onPress: () => {} }],
          "error"
        );
        setIsLoading(false);
        return;
      }
      const userRes = await getUser();

      if (res?.success && userRes?.success) {
        setUser(userRes?.user);
        setNotifications(userRes?.user?.notifications || []);
        setIsLoading(false);
        router.push("/(authentication)/(tabs)/home");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      {AlertComponent}
      <View style={globalStyles.topBar}>
        <Pressable onPress={goBack} style={{ padding: 15 }}>
          <FontAwesome name="chevron-left" color={colors.secondary} size={15} />
        </Pressable>
      </View>

      <CreateContainer
        heading="Enter security PIN"
        text="Your PIN helps you log in faster and approve transactions securely."
      >
        <View style={[globalStyles.form, { paddingTop: 20 }]}>
          <View style={{ paddingHorizontal: s(30) }}>
            <CustomeOtp handleOtp={handleOtp} numberofDigits={4} />
          </View>
        </View>

        <View
          style={{
            marginTop: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLoading && <Spinner width={40} height={40} />}
        </View>

        <View style={globalStyles.bottomContainer}>
          <View style={{ marginBottom: 20 }}>
            <Link href="/forgotPin">
              <Text
                style={{
                  fontWeight: 700,
                  color: colors.white2,
                  fontSize: ms(14),
                }}
              >
                Forgot Pin
              </Text>
            </Link>
          </View>
        </View>
      </CreateContainer>
    </SafeAreaView>
  );
};

export default SecurityPin;

const styles = StyleSheet.create({});
