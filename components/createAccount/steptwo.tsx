import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors } from "@/constants";
import { Dispatch, SetStateAction, useState } from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import CreateContainer from "./CreateContainer";
import { forgotPassword, sendOtp } from "@/utils/countryStore";
import Spinner from "../Spinner";
import { useAlert } from "../AlertService";
import { globalStyles } from "@/utils/globalStyles";
import { ms } from "react-native-size-matters";
import { router } from "expo-router";

type pageProp = {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  setStepCount: Dispatch<SetStateAction<number>>;
  email: string;
  isReset: boolean;
};

const PasswordCondition = ({
  text,
  condition,
}: {
  text: string;
  condition?: boolean;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Feather
        style={{ fontWeight: 200 }}
        name="check-circle"
        color={condition ? "green" : colors.secondary}
        size={14}
      />
      <Text style={{ color: colors.secondary, fontWeight: 200, fontSize: 14 }}>
        {text}
      </Text>
    </View>
  );
};

const StepTwo = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  setStepCount,
  isReset,
  email,
}: pageProp) => {
  const uppercaseRegex = /(?=.*[A-Z])/i;
  const lowercaseRegex = /(?=.*[a-z])/i;
  const numberRegex = /^(?=.*\d).*$/;
  const specialCharacterRegex = /(?=.*[@#$%^&*!])/i;

  const [passwordIsSecure, setPasswordIsSecure] = useState(true);
  const [confirmPasswordIsSecure, setConfirmPasswordIsSecure] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [resetModal, setResetModal] = useState(false);

  const { AlertComponent, showAlert } = useAlert();

  const handleResetPassword = async () => {
    setIsLoading(true);
    console.log(email, password);
    try {
      const res = await forgotPassword(email, password);
      if (res?.success) {
        setIsLoading(false);
        setResetModal(true);
        return;
      }

      if (res?.error) {
        showAlert(
          "Error",
          res?.message,
          [{ text: "Close", onPress: () => {} }],
          "error"
        );
        setIsLoading(false);
        return;
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
      const res = await sendOtp(email);
      if (res?.success) {
        setIsLoading(false);
        showAlert(
          "Success",
          res?.message,
          [{ text: "Next", onPress: () => setStepCount((c) => c + 1) }],
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
  return (
    <>
      {AlertComponent}
      <CreateContainer
        heading={isReset ? "Create new password" : "Create a password"}
        text="Create a strong password to protect your trades and funds."
      >
        <View style={[globalStyles.form, { paddingTop: 20 }]}>
          <Text style={globalStyles.formLabel}>Password</Text>
          <View
            style={[
              globalStyles.formInputContainer,
              password.length > 0
                ? uppercaseRegex.test(password) &&
                  lowercaseRegex.test(password) &&
                  numberRegex.test(password) &&
                  specialCharacterRegex.test(password) &&
                  password.length >= 6
                  ? {
                      borderColor: "green",
                      borderWidth: 1,
                    }
                  : {
                      borderColor: "red",
                      borderWidth: 1,
                    }
                : null,
            ]}
          >
            <TextInput
              placeholder="Enter your password"
              style={[globalStyles.formInput]}
              inputMode="text"
              placeholderTextColor={colors.secondary}
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

        <View style={{ paddingVertical: 10, gap: 10, marginBottom: 20 }}>
          <PasswordCondition
            condition={password.length >= 6}
            text="Minimum of 6 characters"
          />
          <PasswordCondition
            condition={numberRegex.test(password)}
            text="At least 1 number"
          />
          <PasswordCondition
            condition={specialCharacterRegex.test(password)}
            text="At least 1 special character"
          />
          <PasswordCondition
            condition={
              uppercaseRegex.test(password) && lowercaseRegex.test(password)
            }
            text="1 uppercase and 1 lowercase"
          />
        </View>

        <View style={globalStyles.form}>
          <Text style={globalStyles.formLabel}>Confirm Password</Text>
          <View
            style={[
              globalStyles.formInputContainer,
              password.length > 0
                ? password === confirmPassword
                  ? { borderColor: "green", borderWidth: 1 }
                  : { borderColor: "red", borderWidth: 1 }
                : null,
            ]}
          >
            <TextInput
              placeholder="Re-enter your password"
              style={globalStyles.formInput}
              inputMode="text"
              placeholderTextColor={colors.secondary}
              defaultValue={confirmPassword}
              onChangeText={(e) => setConfirmPassword(e)}
              secureTextEntry={confirmPasswordIsSecure}
            />
            <Pressable
              onPress={() => setConfirmPasswordIsSecure((current) => !current)}
            >
              {confirmPasswordIsSecure ? (
                <Feather name="eye-off" style={globalStyles.eye} />
              ) : (
                <Feather name="eye" style={globalStyles.eye} />
              )}
            </Pressable>
          </View>
        </View>

        <View style={globalStyles.bottomContainer}>
          <Pressable
            onPress={isReset ? handleResetPassword : handlePress}
            disabled={
              !uppercaseRegex.test(password) ||
              !lowercaseRegex.test(password) ||
              !numberRegex.test(password) ||
              !specialCharacterRegex.test(password) ||
              password.length < 6 ||
              password !== confirmPassword ||
              isLoading
            }
            style={[
              globalStyles.btn,
              !uppercaseRegex.test(password) ||
              !lowercaseRegex.test(password) ||
              !numberRegex.test(password) ||
              !specialCharacterRegex.test(password) ||
              password.length < 6 ||
              password !== confirmPassword ||
              isLoading
                ? { opacity: 0.3 }
                : {},
            ]}
          >
            <Text style={globalStyles.btnText}>
              {isLoading ? <Spinner width={20} height={20} /> : "Continue"}
            </Text>
          </Pressable>
        </View>

        <Modal
          style={{ flex: 1 }}
          transparent
          visible={resetModal}
          animationType="slide"
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "flex-end",
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View style={styles.resetModalContainer}>
              <MaterialCommunityIcons
                name="check-decagram"
                size={60}
                color="#4DF2BE"
                style={{ marginBottom: 30 }}
              />
              <Text
                style={{
                  color: colors.white2,
                  fontWeight: 700,
                  fontSize: ms(20),
                }}
              >
                Password Changed
              </Text>
              <Text
                style={{
                  color: colors.white,
                  fontWeight: 400,
                  fontSize: ms(14),
                  paddingHorizontal: 10,
                }}
              >
                Your password has been successfully updated. You can now log in
                with your new password.
              </Text>

              <View style={globalStyles.bottomContainer}>
                <Pressable
                  onPress={() => router.replace("/login")}
                  style={[globalStyles.btn]}
                >
                  <Text style={globalStyles.btnText}>Go to log in</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </CreateContainer>
    </>
  );
};

export default StepTwo;

const styles = StyleSheet.create({
  resetModalContainer: {
    backgroundColor: "#222222",
    padding: 10,
    width: "100%",
    borderRadius: 10,
    height: "50%",
    alignItems: "center",
    gap: 10,
  },
});
