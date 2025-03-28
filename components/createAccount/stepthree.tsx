import { StyleSheet, Text, View } from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import CreateContainer from "./CreateContainer";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import { OtpInput } from "react-native-otp-entry";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";

type pageProp = {
  setStepCount: Dispatch<SetStateAction<number>>;
  email: string;
};
const StepThree = ({ setStepCount, email }: pageProp) => {
  const [otp, setOtp] = useState("");
  const [countDown, setCountDown] = useState(30);

  const handleOtp = (e: string) => {
    setOtp(e);
    if (e.length === 6) {
      setStepCount(4);
    }
  };

  const rotation = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  }, [rotation.value]);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1
    );
    return () => {
      rotation.value = 0;
    };
  }, []);

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
        <OtpInput
          blurOnFilled={true}
          numberOfDigits={6}
          type="numeric"
          secureTextEntry
          focusColor="green"
          autoFocus={true}
          hideStick={false}
          focusStickBlinkingDuration={500}
          onFilled={handleOtp}
          theme={{
            containerStyle: styles.otpContainer,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
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
      </View>
      <View
        style={{
          alignItems: "center",
          marginTop: ms(40),
          justifyContent: "center",
        }}
      >
        <Animated.View style={[styles.spinner, animatedStyles]} />
      </View>
    </CreateContainer>
  );
};

export default StepThree;

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
  spinner: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderTopColor: colors.gray2,
    borderRightColor: colors.gray2,
    borderBottomColor: colors.gray2,
    borderLeftColor: "green",
  },
});
