import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
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
import { globalStyles } from "@/utils/globalStyles";
import StepOne from "@/components/createAccount/stepone";
import StepThree from "@/components/createAccount/stepthree";
import StepTwo from "@/components/createAccount/steptwo";
import CreateContainer from "@/components/createAccount/CreateContainer";
import { set } from "lodash";
import { useAlert } from "@/components/AlertService";
import { checkEmailExist, sendOtp } from "@/utils/countryStore";
import Spinner from "@/components/Spinner";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [stepCount, setStepCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { AlertComponent, showAlert } = useAlert();

  const goBack = () => {
    if (router.canGoBack()) router.back();
  };

  const handleEmail = async () => {
    if (!email) return;
    if (!email.includes("@")) return;
    await handleSendOtp();
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await checkEmailExist(email);
      if (res?.error) {
        if (res?.message !== "User does not exist") {
          showAlert(
            "Error",
            res?.message,
            [{ text: "Close", onPress: () => {} }],
            "error"
          );
          setIsLoading(false);
          return;
        }
      }

      if (res?.success) {
        const otpRes = await sendOtp(email);
        if (otpRes?.success) {
          setStepCount((current) => current + 1);
        }
      }
    } catch (error) {
      showAlert(
        "Error",
        String(error),
        [{ text: "Close", onPress: () => {} }],
        "error"
      );
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.topBar}>
        <Pressable onPress={goBack} style={{ padding: 15 }}>
          <FontAwesome name="chevron-left" color={colors.secondary} size={15} />
        </Pressable>
      </View>

      {stepCount === 1 && (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <CreateContainer
            heading="Reset Your Password"
            text="Enter your registered email, and we’ll send you a reset link."
          >
            <View style={globalStyles.form}>
              <Text style={globalStyles.formLabel}>Email</Text>
              <View style={[globalStyles.formInputContainer]}>
                <TextInput
                  placeholder="Enter your email address"
                  style={globalStyles.formInput}
                  inputMode="email"
                  placeholderTextColor={colors.secondary}
                  // defaultValue={email}
                  onChangeText={(e) => setEmail(e)}
                />
              </View>
            </View>
            <View style={[globalStyles.bottomContainer, { paddingBottom: 50 }]}>
              <Pressable
                onPress={handleEmail}
                disabled={!email}
                style={[
                  globalStyles.btn,
                  !email && { opacity: 0.5 },
                  { width: "100%", paddingHorizontal: 0 },
                ]}
              >
                {isLoading ? (
                  <Spinner width={20} height={20} />
                ) : (
                  <Text style={globalStyles.btnText}>Reset password</Text>
                )}
              </Pressable>

              <View>
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    gap: 20,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.secondary,
                      fontSize: 14,
                      lineHeight: 20,
                      fontWeight: 200,
                    }}
                  >
                    Remembered password?
                  </Text>
                  <Link style={globalStyles.link} href={"/login"}>
                    Log in
                  </Link>
                </View>
              </View>
            </View>
          </CreateContainer>
        </ScrollView>
      )}

      {stepCount === 2 && (
        <StepThree email={email} setStepCount={setStepCount} isReset={true} />
      )}

      {stepCount === 3 && (
        <StepTwo
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          setStepCount={setStepCount}
          email={email}
          password={password}
          setPassword={setPassword}
          isReset={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
