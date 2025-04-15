import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { OtpInput } from "react-native-otp-entry";
import { ms } from "react-native-size-matters";
import { colors } from "@/constants";

interface pageProp {
  handleOtp: (e: string) => void;
  numberofDigits: number;
  focus?: boolean;
}
const CustomeOtp = ({ handleOtp, numberofDigits, focus }: pageProp) => {
  return (
    <>
      <OtpInput
        blurOnFilled={true}
        numberOfDigits={numberofDigits}
        type="numeric"
        secureTextEntry
        focusColor="green"
        autoFocus={focus}
        hideStick={false}
        focusStickBlinkingDuration={500}
        onFilled={handleOtp}
        theme={{
          containerStyle: styles.otpContainer,
          pinCodeContainerStyle: styles.pinCodeContainer,
          pinCodeTextStyle: styles.pinCodeText,
        }}
      />
    </>
  );
};

export default CustomeOtp;

const styles = StyleSheet.create({
  otpContainer: {
    width: "100%",
  },
  pinCodeContainer: {
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.gray2,
    height: ms(50),
    borderRadius: 5,
  },
  pinCodeText: {
    color: colors.secondary,
  },
});
