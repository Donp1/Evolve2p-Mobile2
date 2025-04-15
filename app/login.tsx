import {
  Pressable,
  SafeAreaView,
  ScrollView,
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
import { ms } from "react-native-size-matters";
import Spinner from "@/components/Spinner";
import { useAlert } from "@/components/AlertService";
import { checkToken, getUser, login } from "@/utils/countryStore";
import { setItemAsync } from "expo-secure-store";

const Login = () => {
  const [passwordIsSecure, setPasswordIsSecure] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { showAlert, AlertComponent } = useAlert();

  const goBack = () => {
    if (router.canGoBack()) router.back();
  };

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const res = await login({ email, password });

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
        const tokenData = await checkToken(res?.accessToken);
        const parsedUser = await getUser(tokenData?.user?.email);
        await setItemAsync(
          "authToken",
          JSON.stringify({ token: res?.accessToken, user: parsedUser.user })
        );
        setIsLoading(false);
        showAlert(
          "Congratulation!!!",
          "Logged in Successfully",
          [{ text: "Proceed", onPress: () => router.push("/securityPin") }],
          "success"
        );
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
    <>
      {AlertComponent}
      <SafeAreaView style={globalStyles.container}>
        <View style={globalStyles.topBar}>
          <Pressable onPress={goBack} style={{ padding: 15 }}>
            <FontAwesome
              name="chevron-left"
              color={colors.secondary}
              size={15}
            />
          </Pressable>
        </View>
        <ScrollView
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ flexGrow: 1, backgroundColor: "red" }}
        >
          <CreateContainer
            heading="Welcome Back!"
            text="Log in to continue trading securely."
          >
            <View style={[globalStyles.form, { paddingTop: 20 }]}>
              <Text style={globalStyles.formLabel}>Email</Text>
              <View style={[globalStyles.formInputContainer]}>
                <TextInput
                  placeholder="Enter your email address"
                  style={[globalStyles.formInput]}
                  inputMode="email"
                  placeholderTextColor={colors.white}
                  defaultValue={email}
                  onChangeText={(e) => setEmail(e)}
                />
              </View>
            </View>

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
            </View>

            <Link href="/resetPassword" asChild>
              <Pressable
                style={{
                  width: "100%",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginVertical: 10,
                }}
              >
                <Text
                  style={{
                    color: colors.secondary,
                    fontWeight: 700,
                    fontSize: ms(14),
                  }}
                >
                  Forgot password
                </Text>
              </Pressable>
            </Link>

            <View style={globalStyles.bottomContainer}>
              <Pressable
                disabled={isLoading || !email || !password}
                onPress={handleLogin}
                style={[
                  globalStyles.btn,
                  (isLoading || !email || !password) && { opacity: 0.5 },
                ]}
              >
                <Text style={globalStyles.btnText}>
                  {isLoading ? <Spinner width={20} height={20} /> : "Log in"}
                </Text>
              </Pressable>

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
                  Don't have an account?{" "}
                </Text>
                <Link style={globalStyles.link} href={"/register"}>
                  Create one
                </Link>
              </View>

              <View
                style={{
                  gap: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 14,
                    color: colors.secondary,
                    fontWeight: 200,
                    lineHeight: 20,
                  }}
                >
                  By creating an account you are agreeing to our {"\n"}
                  <Link style={globalStyles.link} href={"/register"}>
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link style={globalStyles.link} href={"/register"}>
                    Privacy Policy
                  </Link>
                </Text>
              </View>
            </View>
          </CreateContainer>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({});
