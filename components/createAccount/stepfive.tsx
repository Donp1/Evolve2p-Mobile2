import { StyleSheet, Text, View } from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import CreateContainer from "./CreateContainer";
import { OtpInput } from "react-native-otp-entry";
import CustomeOtp from "../CustomeOtp";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import { updateUser } from "@/utils/countryStore";
import Spinner from "../Spinner";
import { useAlert } from "../AlertService";

interface pageProp {
  setStepCount: Dispatch<SetStateAction<number>>;
}

const StepFive = ({ setStepCount }: pageProp) => {
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { AlertComponent, showAlert } = useAlert();

  const handleOtp = async (confirmPin: string) => {
    try {
      if (confirmPin == pin) {
        setIsLoading(true);
        const res = await updateUser({ pin });
        setIsLoading(false);
        if (res?.success) {
          showAlert(
            "Success",
            "Pin set successfully",
            [{ text: "Next", onPress: () => setStepCount((c) => c + 1) }],
            "success"
          );

          return;
        }

        if (res?.error) {
          showAlert(
            "Error",
            res?.message,
            [{ text: "Close", onPress: () => {} }],
            "error"
          );
        }
      } else {
        showAlert(
          "Error",
          "confirm pin not equal to pin",
          [{ text: "Close", onPress: () => {} }],
          "error"
        );
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CreateContainer
      heading="Setup security Pin"
      text="Your PIN helps you log in faster and approve transactions securely."
    >
      {AlertComponent}
      <View style={{ marginTop: 20, width: "80%", marginHorizontal: "auto" }}>
        <CustomeOtp
          focus={false}
          handleOtp={(e) => setPin(e)}
          numberofDigits={4}
        />
      </View>

      <View style={{ marginTop: 40 }}>
        <Text
          style={{
            fontWeight: 700,
            color: colors.secondary,
            fontSize: ms(24),
            lineHeight: 32,
          }}
        >
          Confirm your PIN
        </Text>
        <Text
          style={{
            fontWeight: 200,
            color: colors.secondary,
            fontSize: ms(14),
            lineHeight: 24,
          }}
        >
          Re-enter your PIN to make sure it’s correct.
        </Text>

        <View style={{ marginTop: 20, width: "80%", marginHorizontal: "auto" }}>
          <CustomeOtp focus={false} handleOtp={handleOtp} numberofDigits={4} />
        </View>
      </View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {isLoading && <Spinner width={40} height={40} />}
      </View>
    </CreateContainer>
  );
};

export default StepFive;

const styles = StyleSheet.create({});
