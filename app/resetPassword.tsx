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
import { globalStyles } from "@/utils/globalStyles";
import StepOne from "@/components/createAccount/stepone";
import StepThree from "@/components/createAccount/stepthree";
import StepTwo from "@/components/createAccount/steptwo";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [stepCount, setStepCount] = useState(1);

  const goBack = () => {
    if (router.canGoBack()) router.back();
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.topBar}>
        <Pressable onPress={goBack} style={{ padding: 15 }}>
          <FontAwesome name="chevron-left" color={colors.secondary} size={15} />
        </Pressable>
      </View>

      {stepCount === 1 && (
        <StepOne
          email={email}
          isReset={true}
          setEmail={setEmail}
          setStepCount={setStepCount}
        />
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
};

export default ResetPassword;

const styles = StyleSheet.create({});
