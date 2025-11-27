import React, { useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ms } from "react-native-size-matters";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Link, router } from "expo-router";

import { colors } from "@/constants";
import { globalStyles } from "@/utils/globalStyles";
import CreateContainer from "@/components/createAccount/CreateContainer";
import Spinner from "@/components/Spinner";
import { useAlert } from "@/components/AlertService";
import { login, updateUser } from "@/utils/countryStore";
import { setItemAsync } from "expo-secure-store";
import { useNotification } from "@/context/NotificationContext";

const Login = () => {
  const [passwordIsSecure, setPasswordIsSecure] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { showAlert, AlertComponent } = useAlert();

  const { error, expoPushToken, notification } = useNotification();

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return;

    setIsLoading(true);
    try {
      const res = await login({ email, password });

      if (res?.error) {
        showAlert(
          "Error",
          res?.message,
          [{ text: "Close", onPress() {} }],
          "error"
        );
        return;
      }

      if (res?.success) {
        await setItemAsync(
          "authToken",
          JSON.stringify({ token: res?.accessToken })
        );

        if (expoPushToken) {
          const setToken = await updateUser({ pushToken: expoPushToken });
          console.log(setToken);
          router.push("/securityPin");
        }
      }
    } catch (error: any) {
      const message =
        error?.message === "Network request failed"
          ? "Unable to connect. Please check your internet connection."
          : String(error);

      showAlert("Error", message, [{ text: "Close", onPress() {} }], "error");
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {AlertComponent}
      <SafeAreaView style={globalStyles.container}>
        <View style={globalStyles.topBar}>
          <Pressable onPress={goBack} style={styles.backButton}>
            <FontAwesome
              name="chevron-left"
              color={colors.secondary}
              size={15}
            />
          </Pressable>
        </View>

        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid
          extraScrollHeight={20} // pushes content above keyboard
        >
          <CreateContainer
            heading="Welcome Back!"
            text="Log in to continue trading securely."
          >
            {/* Email */}
            <View style={[globalStyles.form, styles.formSpacing]}>
              <Text style={globalStyles.formLabel}>Email</Text>
              <View style={globalStyles.formInputContainer}>
                <TextInput
                  // defaultValue={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email address"
                  style={globalStyles.formInput}
                  inputMode="email"
                  placeholderTextColor={colors.white}
                />
              </View>
            </View>

            {/* Password */}
            <View style={[globalStyles.form, styles.formSpacing]}>
              <Text style={globalStyles.formLabel}>Password</Text>
              <View style={globalStyles.formInputContainer}>
                <TextInput
                  // defaultValue={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  style={globalStyles.formInput}
                  secureTextEntry={passwordIsSecure}
                  placeholderTextColor={colors.white}
                />
                <Pressable onPress={() => setPasswordIsSecure((prev) => !prev)}>
                  <Feather
                    name={passwordIsSecure ? "eye-off" : "eye"}
                    style={globalStyles.eye}
                  />
                </Pressable>
              </View>
            </View>

            {/* Forgot password */}
            <Link href="/resetPassword" asChild>
              <Pressable style={styles.forgotPressable}>
                <Text style={styles.forgotText}>Forgot password</Text>
              </Pressable>
            </Link>

            {/* Login button */}
            <View style={globalStyles.bottomContainer}>
              <Pressable
                disabled={isLoading || !email || !password}
                onPress={handleLogin}
                style={[
                  globalStyles.btn,
                  (isLoading || !email || !password) && { opacity: 0.5 },
                ]}
              >
                {isLoading ? (
                  <Spinner width={20} height={20} />
                ) : (
                  <Text style={globalStyles.btnText}>Log in</Text>
                )}
              </Pressable>

              {/* Register */}
              <View style={styles.registerRow}>
                <Text style={styles.registerText}>Don't have an account?</Text>
                <Link style={globalStyles.link} href="/register">
                  Create one
                </Link>
              </View>

              {/* Terms */}
              <View style={styles.termsWrapper}>
                <Text style={styles.termsText}>
                  By creating an account you are agreeing to our {"\n"}
                  <Link style={globalStyles.link} href="/register">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link style={globalStyles.link} href="/register">
                    Privacy Policy
                  </Link>
                </Text>
              </View>
            </View>
          </CreateContainer>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  backButton: {
    padding: 15,
  },
  formSpacing: {
    paddingTop: 20,
  },
  forgotPressable: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginVertical: 10,
  },
  forgotText: {
    color: colors.secondary,
    fontWeight: "700",
    fontSize: ms(14),
  },
  registerRow: {
    width: "100%",
    alignItems: "center",
    gap: 8,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: colors.secondary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },
  termsWrapper: {
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  termsText: {
    textAlign: "center",
    fontSize: 14,
    color: colors.secondary,
    fontWeight: "400",
    lineHeight: 20,
  },
});
