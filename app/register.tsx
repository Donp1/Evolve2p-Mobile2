import {
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors } from "@/constants";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import StepOne from "@/components/createAccount/stepone";
import StepTwo from "@/components/createAccount/steptwo";
import StepThree from "@/components/createAccount/stepthree";
import StepFour from "@/components/createAccount/stepfour";
import { DataProp } from "@/components/SelectDropdown";

const Register = () => {
  const goBack = () => {
    if (router.canGoBack()) router.back();
  };

  const MAX_STEP = 6;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stepCount, setStepCount] = useState(4);
  const [selectedCountry, setSelectedCountry] = useState<DataProp | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={goBack} style={{ padding: 15 }}>
          <FontAwesome name="chevron-left" color={colors.secondary} size={15} />
        </Pressable>
        <View
          style={{
            backgroundColor: colors.gray2,
            borderRadius: 100,
            paddingHorizontal: 15,
            paddingVertical: 5,
            marginHorizontal: 10,
          }}
        >
          <Text style={{ color: colors.secondary, fontWeight: 600 }}>
            Step {stepCount} of {MAX_STEP}
          </Text>
        </View>
      </View>

      {/* {stepCount === 1 && (
          <StepOne
            setStepCount={setStepCount}
            setEmail={setEmail}
            email={email}
          />
        )}
        {stepCount === 2 && (
          <StepTwo
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            setStepCount={setStepCount}
          />
        )}
        {stepCount === 3 && (
          <StepThree email={email} setStepCount={setStepCount} />
        )} */}
      {stepCount === 4 && (
        <StepFour
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          setStepCount={setStepCount}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          username={username}
          setUsername={setUsername}
        />
      )}
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  topBar: {
    width: "100%",
    height: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    flexDirection: "row",
  },
});
