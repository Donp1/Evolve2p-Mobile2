import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { OtpInput } from "react-native-otp-entry";
import { ms, s } from "react-native-size-matters";
import { colors } from "@/constants";

interface pageProp {
  handleOtp: (e: string) => void;
  numberofDigits: number;
  focus?: boolean;
  secureTextEntry?: boolean;
}
const CustomeOtp = ({
  handleOtp,
  numberofDigits,
  focus,
  secureTextEntry = true,
}: pageProp) => {
  return (
    <>
      <OtpInput
        blurOnFilled={true}
        numberOfDigits={numberofDigits}
        type="numeric"
        secureTextEntry={secureTextEntry}
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
    height: ms(60),
    borderRadius: 5,
    width: ms(50),
  },
  pinCodeText: {
    color: colors.secondary,
  },
});
