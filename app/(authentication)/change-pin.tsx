import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalStyles } from "@/utils/globalStyles";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "@/constants";
import { router } from "expo-router";
import { ms, s, vs } from "react-native-size-matters";
import CustomeOtp from "@/components/CustomeOtp";
import Spinner from "@/components/Spinner";
import { checkPin, updateUser } from "@/utils/countryStore";
import { useAlert } from "@/components/AlertService";
import { SafeAreaView } from "react-native-safe-area-context";

const ChangePin = () => {
  const [screen, setScreen] = React.useState("one");
  const [loading, setLoading] = React.useState(false);
  const [pin, setPin] = React.useState("");
  const [confirmPin, setConfirmPin] = React.useState("");

  const { AlertComponent, showAlert } = useAlert();

  const goBack = () => {
    if (router.canGoBack()) router.back();
  };

  const handlePinCheck = async (pinData: string) => {
    try {
      setLoading(true);
      const res = await checkPin(pinData);

      if (res?.error) {
        setLoading(false);
        showAlert(
          "Error",
          res?.message,
          [{ onPress: () => {}, text: "Close" }],
          "error"
        );
        return;
      }

      if (res?.success) {
        setLoading(false);
        setScreen("two");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleUpdate = async (pinData: string) => {
    try {
      setLoading(true);

      if (pinData !== pin) {
        setLoading(false);
        showAlert(
          "Error",
          "PINs do not match",
          [{ onPress: () => {}, text: "Close" }],
          "error"
        );
        return;
      }

      const res = await updateUser({ pin: pinData });
      if (res?.error) {
        setLoading(false);
        showAlert(
          "Error",
          res?.message,
          [{ onPress: () => {}, text: "Close" }],
          "error"
        );
        return;
      }

      if (res?.success) {
        setLoading(false);
        showAlert(
          "Success",
          "PIN updated successfully",
          [{ onPress: () => goBack(), text: "Close" }],
          "success"
        );
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.topBar}>
        <Pressable
          onPress={goBack}
          style={{
            padding: 15,
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <FontAwesome name="chevron-left" color={colors.secondary} size={15} />
          <Text
            style={{
              lineHeight: 24,
              fontWeight: 500,
              fontSize: ms(16),
              color: colors.secondary,
            }}
          >
            Profile
          </Text>
        </Pressable>
      </View>
      {AlertComponent}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 20,
          paddingHorizontal: 10,
          paddingBottom: 100,
          backgroundColor: colors.primary,
          flex: 1,
        }}
      >
        {screen === "one" && (
          <View
            style={{
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: ms(20),
                fontWeight: 700,
                color: colors.white2,
                marginBottom: vs(10),
              }}
            >
              Update PIN
            </Text>
            <Text
              style={{
                fontSize: ms(14),
                fontWeight: 400,
                color: colors.white,
                lineHeight: vs(20),
                marginBottom: 20,
              }}
            >
              For security reasons, enter your current PIN before setting a new
              one.
            </Text>

            <View style={{ paddingHorizontal: s(30) }}>
              <CustomeOtp handleOtp={handlePinCheck} numberofDigits={4} />
            </View>
          </View>
        )}
        {screen === "two" && (
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: ms(20),
                fontWeight: 700,
                color: colors.white2,
                marginBottom: vs(10),
              }}
            >
              Enter new PIN
            </Text>
            <Text
              style={{
                fontSize: ms(14),
                fontWeight: 400,
                color: colors.white,
                lineHeight: vs(20),
                marginBottom: 20,
              }}
            >
              Your PIN helps you log in faster and approve transactions
              securely.
            </Text>
            <View style={{ paddingHorizontal: s(30) }}>
              <CustomeOtp
                handleOtp={(e) => {
                  setPin(e);
                  setScreen("three");
                }}
                numberofDigits={4}
              />
            </View>
          </View>
        )}
        {screen === "three" && (
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: ms(20),
                fontWeight: 700,
                color: colors.white2,
                marginBottom: vs(10),
              }}
            >
              Confirm your PIN
            </Text>
            <Text
              style={{
                fontSize: ms(14),
                fontWeight: 400,
                color: colors.white,
                lineHeight: vs(20),
                marginBottom: 20,
              }}
            >
              Re-enter your PIN to make sure it’s correct.
            </Text>
            <View style={{ paddingHorizontal: s(30) }}>
              <CustomeOtp handleOtp={handleUpdate} numberofDigits={4} />
            </View>
          </View>
        )}

        <View
          style={{
            marginTop: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading && <Spinner width={40} height={40} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePin;

const styles = StyleSheet.create({});
