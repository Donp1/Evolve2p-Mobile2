import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { globalStyles } from "@/utils/globalStyles";
import { colors } from "@/constants";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { ms, s, vs } from "react-native-size-matters";
import { Image } from "expo-image";
import {
  formatSecretWithDashes,
  generate2fa,
  verifySecret,
} from "@/utils/countryStore";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import BottomSheet from "./BottomSheet";
import { useAlert } from "./AlertService";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import CustomeOtp from "./CustomeOtp";
import Spinner from "./Spinner";

interface pageProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setPassed: Dispatch<SetStateAction<boolean>>;
}
const SecurityCheck = ({ visible, setVisible, setPassed }: pageProps) => {
  const [qrd, setQrd] = useState("");
  const [secret, setSecret] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const { AlertComponent, showAlert } = useAlert();

  // useEffect(() => {
  //   (async () => {
  //     const res = await generate2fa();
  //     if (res?.error) {
  //       showAlert(
  //         "Error",
  //         res?.message || "Unable to generate 2FA",
  //         [{ text: "OK", onPress() {} }],
  //         "error"
  //       );
  //       return;
  //     }

  //     if (res?.success) {
  //       setQrd(res?.qrCode);
  //       setSecret(res?.secret);
  //     }
  //     console.log(res);
  //   })();
  // }, []);

  const handleOtp = async (token: string) => {
    setIsVerifying(true);
    if (token.length < 6) {
      showAlert(
        "error",
        "Please enter a valid 6-digit code",
        [{ text: "close", onPress: () => {} }],
        "error"
      );
      setIsVerifying(false);
      return;
    }

    const res = await verifySecret(token);
    if (res?.error) {
      setIsVerifying(false);
      showAlert(
        "error",
        res?.message,
        [{ text: "close", onPress: () => {} }],
        "error"
      );
      return;
    }

    if (res?.success) {
      setIsVerifying(false);
      setPassed(true);
      setVisible(false);
    }
  };

  return (
    <BottomSheet setVisible={setVisible} visible={visible} height={vs(90)}>
      <SafeAreaView style={[globalStyles.container, {}]}>
        {AlertComponent}

        <View style={globalStyles.topBar}>
          <Pressable
            onPress={() => setVisible(false)}
            style={{
              padding: 15,
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <FontAwesome
              name="chevron-left"
              color={colors.secondary}
              size={15}
            />
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
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <View style={styles.content}>
            {AlertComponent}
            <Text
              style={{
                fontSize: ms(20),
                fontWeight: 700,
                color: colors.white2,
                marginBottom: vs(10),
              }}
            >
              Enter your 6-digit 2FA code to confirm this action
            </Text>
            <Text
              style={{
                fontSize: ms(12),
                fontWeight: 400,
                color: colors.secondary,
                lineHeight: 20,
              }}
            >
              Enter the verification code from your 2FA app to finish setting up
              two-factor authentication
            </Text>

            <View style={{ marginTop: vs(20), gap: 20 }}>
              <CustomeOtp
                secureTextEntry={false}
                handleOtp={handleOtp}
                numberofDigits={6}
              />
            </View>

            <View
              style={{
                marginTop: vs(30),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isVerifying ? <Spinner width={40} height={40} /> : null}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BottomSheet>
  );
};

export default SecurityCheck;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingVertical: vs(20),
    paddingHorizontal: s(20),
    backgroundColor: colors.primary,
  },
});
