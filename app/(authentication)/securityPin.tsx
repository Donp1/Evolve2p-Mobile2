import {
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors } from "@/constants";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import CreateContainer from "@/components/createAccount/CreateContainer";
import { globalStyles } from "@/utils/globalStyles";
import { ms, s } from "react-native-size-matters";
import Spinner from "@/components/Spinner";
import CustomeOtp from "@/components/CustomeOtp";
import { useAlert } from "@/components/AlertService";
import { checkToken, getUser } from "@/utils/countryStore";
import { getItemAsync } from "expo-secure-store";

const SecurityPin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { showAlert, AlertComponent } = useAlert();

  const goBack = () => {
    if (router.canGoBack()) router.back();
  };

  const handleOtp = async (pin: string) => {
    setIsLoading(true);

    try {
      const authData = await getItemAsync("authToken");
      const token = authData ? JSON.parse(authData)?.token : null;
      const res = await checkToken(token);
      if (res?.error) {
        setIsLoading(false);
        showAlert(
          "Error",
          res?.message,
          [{ text: "Close", onPress() {} }],
          "error"
        );
        return;
      }

      if (res?.success) {
        const userRes = await getUser(res?.user?.email);
        setIsLoading(false);
        if (userRes?.error) {
          setIsLoading(false);
          showAlert(
            "Error",
            userRes?.message,
            [{ text: "Close", onPress() {} }],
            "error"
          );
          return;
        }
        if (userRes?.success) {
          if (userRes?.user?.pin == pin) {
            router.replace("/(authentication)/(tabs)/home");
          } else {
            showAlert(
              "Error",
              "Invalid Pin",
              [{ text: "Close", onPress() {} }],
              "error"
            );
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      showAlert(
        "Error",
        String(error),
        [{ text: "Close", onPress() {} }],
        "error"
      );
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
          <View>
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
