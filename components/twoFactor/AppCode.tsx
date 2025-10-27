import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { globalStyles } from "@/utils/globalStyles";
import { colors } from "@/constants";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { ms, s, vs } from "react-native-size-matters";
import { Image } from "expo-image";
import {
  formatSecretWithDashes,
  updateUser,
  verifySecret,
} from "@/utils/countryStore";
import * as Clipboard from "expo-clipboard";
import CustomeOtp from "../CustomeOtp";
import Spinner from "../Spinner";
import { useAlert } from "../AlertService";

interface pageProps {
  selectedRoute: string;
  setSelectedRoute: Dispatch<SetStateAction<string>>;
}
const AppCode = ({ setSelectedRoute }: pageProps) => {
  const [loading, setLoading] = React.useState(false);

  const { AlertComponent, showAlert } = useAlert();

  const goBack = () => {
    setSelectedRoute("app-security");
  };

  const handleOtp = async (token: string) => {
    setLoading(true);
    if (token.length < 6) {
      showAlert(
        "error",
        "Please enter a valid 6-digit code",
        [{ text: "close", onPress: () => {} }],
        "error"
      );
      setLoading(false);
      return;
    }

    const res = await verifySecret(token);
    if (res?.success) {
      const updated = await updateUser({
        is2faEnabled: true,
      });

      if (updated.error) {
        console.log(updated.message);
        return;
      }

      showAlert(
        "success",
        "2FA has been successfully enabled",
        [{ text: "close", onPress: () => setSelectedRoute("home") }],
        "success"
      );
      setLoading(false);
    } else {
      showAlert(
        "error",
        res?.message,
        [{ text: "close", onPress: () => {} }],
        "error"
      );
      setLoading(false);
    }
  };

  return (
    <>
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
            Enter Your 6-Digit Code
          </Text>
          <Text
            style={{
              fontSize: ms(12),
              fontWeight: 400,
              color: colors.secondary,
              lineHeight: 20,
            }}
          >
            Enter the code from your security app to complete setup.
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
            {loading ? <Spinner width={40} height={40} /> : null}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default AppCode;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingVertical: vs(20),
    paddingHorizontal: s(20),
    backgroundColor: colors.primary,
  },
});
