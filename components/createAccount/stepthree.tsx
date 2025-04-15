import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import CreateContainer from "./CreateContainer";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import { OtpInput } from "react-native-otp-entry";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { sendOtp, verifyOtp } from "@/utils/countryStore";
import Spinner from "../Spinner";
import CustomeOtp from "../CustomeOtp";
import { useAlert } from "../AlertService";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

type pageProp = {
  setStepCount: Dispatch<SetStateAction<number>>;
  email: string;
  isReset: boolean;
};
const StepThree = ({ setStepCount, email, isReset }: pageProp) => {
  const [countDown, setCountDown] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { AlertComponent, showAlert } = useAlert();

  const handleOtp = async (otp: string) => {
    setIsLoading(true);
    try {
      if (otp.length >= 6) {
        const res = await verifyOtp(email, otp);
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
          setIsLoading(false);
          showAlert(
            "Error",
            res?.message,
            [{ text: "Close", onPress: () => {} }],
            "error"
          );
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

  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await sendOtp(email);

      if (res?.success) {
        showAlert(
          "Success",
          res?.message,
          [{ text: "Close", onPress: () => setCountDown(30) }],
          "success"
        );
        setIsResending(false);
      }
    } catch (error) {
      setIsResending(false);
      showAlert(
        "Error",
        String(error),
        [{ text: "Close", onPress: () => {} }],
        "error"
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CreateContainer
      heading="Verify Email"
      text="Please enter the 6-digit code sent to"
    >
      {AlertComponent}
      <Text
        style={{
          fontWeight: 400,
          color: colors.secondary,
          fontSize: ms(12),
          lineHeight: 24,
        }}
      >
        {email}
      </Text>

      <View style={{ marginVertical: ms(20) }}>
        <CustomeOtp numberofDigits={6} handleOtp={handleOtp} />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Text
          style={{
            fontWeight: 200,
            color: colors.secondary,
            fontSize: ms(14),
            lineHeight: 24,
            flex: 1,
          }}
        >
          Didn&apos;t receive code?
        </Text>

        {countDown <= 0 ? (
          <Pressable
            disabled={isResending}
            onPress={handleResend}
            style={[styles.btn, isResending && { opacity: 0.3 }]}
          >
            <Text style={styles.btnText}>
              {isResending ? <Spinner width={20} height={20} /> : "Resend"}
            </Text>
          </Pressable>
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: colors.gray2,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 10,
              borderRadius: 100,
            }}
          >
            <Text
              style={{
                fontWeight: 700,
                color: colors.secondary,
                fontSize: ms(12),
              }}
            >
              Resend code in {countDown}s
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          alignItems: "center",
          marginTop: ms(40),
          justifyContent: "center",
        }}
      >
        {isLoading && <Spinner width={40} height={40} />}
      </View>
    </CreateContainer>
  );
};

export default StepThree;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#4DF2BE",
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    paddingVertical: 12,
  },
  btnText: {
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: 1,
    color: colors.primary,
  },
});
