import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { globalStyles } from "@/utils/globalStyles";
import { router } from "expo-router";
import { colors } from "@/constants";
import { ms, vs } from "react-native-size-matters";
import CreateContainer from "@/components/createAccount/CreateContainer";
import { useAlert } from "@/components/AlertService";
import { changePassword } from "@/utils/countryStore";
import Spinner from "@/components/Spinner";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const passwordCriteria = [
  {
    label: "Minimum 6 characters",
    check: (pwd: string) => pwd.length >= 6,
  },
  {
    label: "At least 1 number",
    check: (pwd: string) => /\d/.test(pwd),
  },
  {
    label: "At least 1 special character",
    check: (pwd: string) => /[^A-Za-z0-9]/.test(pwd),
  },
  {
    label: "1 uppercase and 1 lowercase",
    check: (pwd: string) => /[a-z]/.test(pwd) && /[A-Z]/.test(pwd),
  },
];

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const allValid = passwordCriteria.every((c) => c.check(newPassword));
  const passwordsMatch = newPassword === confirmPassword;

  const isButtonEnabled = allValid && passwordsMatch;

  const { AlertComponent, showAlert } = useAlert();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showAlert(
        "Error",
        "Please fill in all fields",
        [{ onPress: () => {}, text: "Close" }],
        "error"
      );
      return;
    }

    if (!allValid) {
      showAlert(
        "Error",
        "Invalid password format",
        [{ onPress: () => {}, text: "Close" }],
        "error"
      );
      return;
    }

    if (!passwordsMatch) {
      showAlert(
        "Error",
        "Password do not match",
        [{ onPress: () => {}, text: "Close" }],
        "error"
      );
      return;
    }

    try {
      setLoading(true);
      const res = await changePassword(currentPassword, newPassword);
      if (res?.error) {
        showAlert(
          "Error",
          res?.message,
          [{ onPress: () => {}, text: "Close" }],
          "error"
        );
        setLoading(false);
        return;
      }

      if (res?.success) {
        showAlert(
          "Successfull",
          res?.message,
          [{ onPress: () => {}, text: "Proceed" }],
          "success"
        );
        setConfirmPassword("");
        setCurrentPassword("");
        setNewPassword("");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const goBack = () => {
    if (router.canGoBack()) router.back();
  };
  return (
    <SafeAreaView style={globalStyles.container}>
      {AlertComponent}
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
          ></Text>
        </Pressable>
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={20} // pushes content above keyboard
      >
        <CreateContainer
          heading={"Change Password"}
          text={"Create a strong password to protect your trades and funds."}
        >
          <View style={[globalStyles.form, { marginTop: 10 }]}>
            {/* Current Password */}
            <View style={globalStyles.formInputContainer}>
              <TextInput
                placeholder="Current password"
                placeholderTextColor="#888"
                secureTextEntry={!showCurrent}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                style={globalStyles.formInput}
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                <Feather
                  name={showCurrent ? "eye-off" : "eye"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            {/* New Password */}
            <View
              style={[globalStyles.formInputContainer, styles.inputWithBorder]}
            >
              <TextInput
                placeholder="New Password"
                placeholderTextColor="#888"
                secureTextEntry={!showNew}
                value={newPassword}
                onChangeText={setNewPassword}
                style={globalStyles.formInput}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                <Feather
                  name={showNew ? "eye-off" : "eye"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            {/* Criteria List */}
            <View style={styles.criteriaList}>
              {passwordCriteria.map((item, idx) => {
                const passed = item.check(newPassword);
                return (
                  <View key={idx} style={styles.criteriaItem}>
                    <Feather
                      name="check-circle"
                      size={16}
                      color={passed ? "#00e676" : "#555"}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={{ color: passed ? "#00e676" : "#888" }}>
                      {item.label}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Confirm Password */}
            <View style={globalStyles.formInputContainer}>
              <TextInput
                placeholder="Confirm New Password"
                placeholderTextColor="#888"
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={globalStyles.formInput}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Feather
                  name={showConfirm ? "eye-off" : "eye"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* <View style={globalStyles.bottomContainer}> */}
          {/* Continue Button */}
          <Pressable
            onPress={handleChangePassword}
            disabled={!isButtonEnabled || loading}
            style={[
              globalStyles.btn,
              {
                backgroundColor: colors.accent,
                width: "100%",
                marginTop: vs(40),
              },
              !isButtonEnabled && { opacity: 0.5 },
            ]}
          >
            {loading ? (
              <Spinner width={20} height={20} />
            ) : (
              <Text style={globalStyles.btnText}>Continue</Text>
            )}
          </Pressable>
          {/* </View> */}
        </CreateContainer>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    justifyContent: "space-between",
  },
  inputWithBorder: {
    borderWidth: 1,
    borderColor: "#00e676",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  criteriaList: {
    marginBottom: 16,
    marginTop: -4,
  },
  criteriaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
});
