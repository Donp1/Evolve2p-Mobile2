import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { globalStyles } from "@/utils/globalStyles";
import { colors } from "@/constants";
import { Link, router } from "expo-router";
import CreateContainer from "@/components/createAccount/CreateContainer";
import { ms, s } from "react-native-size-matters";
import Spinner from "@/components/Spinner";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomeOtp from "@/components/CustomeOtp";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { forgotPin } from "@/utils/countryStore";
import { useAlert } from "@/components/AlertService";

const ForgotPin = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordIsSecure, setPasswordIsSecure] = useState(true);
  const [newPin, setNewPin] = useState("");

  const { AlertComponent, showAlert } = useAlert();

  const goBack = () => {
    if (router.canGoBack()) router.back();
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const res = await forgotPin(newPin, password);

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
        setIsLoading(false);
        showAlert(
          "Success",
          res?.message,
          [
            {
              text: "OK",
              onPress() {
                router.push("/(authentication)/securityPin");
              },
            },
          ],
          "success"
        );
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleOtp = async (pin: string) => {
    if (pin?.length >= 4) {
      setNewPin(pin);
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container]}>
      {AlertComponent}
      <View style={globalStyles.topBar}>
        <Pressable onPress={goBack} style={{ padding: 15 }}>
          <FontAwesome name="chevron-left" color={colors.secondary} size={15} />
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        extraScrollHeight={20}
      >
        <CreateContainer
          heading="Reset Security PIN"
          text="For your security, please enter your account password to reset your PIN."
        >
          <View style={[globalStyles.form, { paddingTop: 20 }]}>
            <Text style={globalStyles.formLabel}>Password</Text>
            <View style={[globalStyles.formInputContainer]}>
              <TextInput
                placeholder="Enter your password"
                style={[globalStyles.formInput]}
                inputMode="text"
                placeholderTextColor={colors.white}
                defaultValue={password}
                onChangeText={(e) => setPassword(e)}
                secureTextEntry={passwordIsSecure}
                autoFocus
              />

              <Pressable
                onPress={() => setPasswordIsSecure((current) => !current)}
              >
                {passwordIsSecure ? (
                  <Feather name="eye-off" style={globalStyles.eye} />
                ) : (
                  <Feather name="eye" style={globalStyles.eye} />
                )}
              </Pressable>
            </View>
            <Text style={globalStyles.formLabel}>New PIN</Text>
            <View style={[globalStyles.form, styles.form]}>
              <View style={styles.otpWrapper}>
                <CustomeOtp handleOtp={handleOtp} numberofDigits={4} />
              </View>
            </View>
          </View>

          <View style={globalStyles.bottomContainer}>
            <Pressable
              disabled={isLoading || !password || !newPin}
              onPress={handleLogin}
              style={[
                globalStyles.btn,
                (isLoading || !password || !newPin) && { opacity: 0.5 },
                { marginVertical: 20 },
              ]}
            >
              <Text style={globalStyles.btnText}>
                {isLoading ? <Spinner width={20} height={20} /> : "Continue"}
              </Text>
            </Pressable>
          </View>
        </CreateContainer>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ForgotPin;

const styles = StyleSheet.create({
  form: {
    paddingTop: 20,
  },
  otpWrapper: {
    paddingHorizontal: s(30),
  },
});
