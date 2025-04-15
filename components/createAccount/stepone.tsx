import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors } from "@/constants";
import { Link } from "expo-router";
import { ms } from "react-native-size-matters";
import { Dispatch, SetStateAction, useState } from "react";
import CreateContainer from "./CreateContainer";
import { checkEmailExist, sendOtp } from "@/utils/countryStore";
import Spinner from "../Spinner";
import { useAlert } from "../AlertService";
import { globalStyles } from "@/utils/globalStyles";
type pageProp = {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  setStepCount: Dispatch<SetStateAction<number>>;
  isReset: boolean;
};

const StepOne = ({ email, setEmail, setStepCount, isReset }: pageProp) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { AlertComponent, showAlert } = useAlert();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const userRes = await checkEmailExist(email);
      if (!userRes?.success) {
        setIsLoading(false);
        console.log("Email is not registered");
        showAlert(
          "Error",
          "Email is not registered",
          [{ text: "Close", onPress: () => {} }],
          "error"
        );
        return;
      }

      const res = await sendOtp(email);
      if (res?.success) {
        setIsLoading(false);
        showAlert(
          "Success",
          res?.message,
          [
            {
              text: "Next",
              onPress: () => setStepCount((current) => current + 1),
            },
          ],
          "success"
        );
      }

      if (res?.error) {
        showAlert(
          "Error",
          res?.message,
          [{ text: "Close", onPress: () => {} }],
          "error"
        );
        setIsLoading(false);
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

  const handlePress = async () => {
    setIsLoading(true);
    try {
      const res = await checkEmailExist(email);
      setIsLoading(false);

      if (res?.success) {
        showAlert(
          "Error",
          res?.message,
          [{ text: "Close", onPress: () => {} }],
          "error"
        );
        setError(true);
        return;
      }

      if (emailRegex.test(email)) {
        if (isReset) {
          await handleSendOtp();
        } else {
          setStepCount((current) => current + 1);
        }
      }
    } catch (error) {
      setIsLoading(false);
      showAlert(
        "Error",
        String(error),
        [{ text: "Close", onPress: () => {} }],
        "error"
      );
    }
  };

  return (
    <>
      {AlertComponent}
      <CreateContainer
        heading={isReset ? "Reset Your Password" : "Create account"}
        text={
          isReset
            ? "Enter your registered email, and we'll send you a reset link."
            : "Enter your email to start trading securely."
        }
      >
        <View style={globalStyles.form}>
          <Text style={globalStyles.formLabel}>Email</Text>
          <View style={[globalStyles.formInputContainer]}>
            <TextInput
              placeholder="Enter your email address"
              style={globalStyles.formInput}
              inputMode="email"
              placeholderTextColor={colors.secondary}
              defaultValue={email}
              onChangeText={(e) => setEmail(e)}
            />
          </View>
          {error && (
            <Text
              style={{
                color: "red",
                fontWeight: 400,
                textAlign: "center",
                fontSize: 15,
              }}
            >
              Email already exists
            </Text>
          )}
        </View>

        <View style={globalStyles.bottomContainer}>
          <Pressable
            onPress={isReset ? handleSendOtp : handlePress}
            disabled={!emailRegex.test(email) || isLoading}
            style={[
              globalStyles.btn,
              (!emailRegex.test(email) || isLoading) && { opacity: 0.5 },
            ]}
          >
            {isLoading ? (
              <Spinner width={20} height={20} />
            ) : (
              <Text style={globalStyles.btnText}>
                {isReset ? "Reset password" : "Continue"}
              </Text>
            )}
          </Pressable>

          {!isReset && (
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
                  Already have an account?{" "}
                </Text>
                <Link style={globalStyles.link} href={"/login"}>
                  Log in
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
          )}
        </View>
      </CreateContainer>
    </>
  );
};

export default StepOne;

const styles = StyleSheet.create({});
