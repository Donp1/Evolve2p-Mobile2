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
import { formatSecretWithDashes } from "@/utils/countryStore";
import * as Clipboard from "expo-clipboard";

interface pageProps {
  selectedRoute: string;
  setSelectedRoute: Dispatch<SetStateAction<string>>;
  selectedMethod: string;
  setSelectedMethod: Dispatch<SetStateAction<string>>;
  secret: string;
  qrd: string;
}
const AppSecurity = ({ setSelectedRoute, secret, qrd }: pageProps) => {
  const copyToClipboard = async () => {
    const copied = await Clipboard.setStringAsync(secret);
  };

  const goBack = () => {
    setSelectedRoute("methods");
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
          <Text
            style={{
              fontSize: ms(20),
              fontWeight: 700,
              color: colors.white2,
              marginBottom: vs(10),
            }}
          >
            Enable security app
          </Text>
          <Text
            style={{
              fontSize: ms(14),
              fontWeight: 400,
              color: colors.white,
              marginBottom: vs(10),
              lineHeight: 20,
            }}
          >
            To enable 2FA, you will have to install an authenticator app on your
            phone, and scan the QR code below to add Evolve2P.
          </Text>
          <Image
            source={{ uri: qrd }}
            style={{
              width: 200,
              height: 200,
              marginVertical: 20,
              alignSelf: "center",
            }}
            priority={"high"}
            contentFit="contain"
            transition={1000}
          />
          <Text
            style={{
              fontSize: ms(14),
              fontWeight: 400,
              color: colors.white,
              marginBottom: vs(10),
              lineHeight: 20,
            }}
          >
            Can’t scan the QR code? Configure your app with this key
          </Text>
          <View style={globalStyles.sectionBox}>
            <View style={[globalStyles.sectionMain, { paddingVertical: 5 }]}>
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: ms(12),
                  color: colors.secondary,
                  flex: 1,
                  paddingEnd: s(25),
                  lineHeight: vs(20),
                }}
              >
                {formatSecretWithDashes(secret, 8)}
              </Text>
              <Pressable
                onPress={copyToClipboard}
                style={[
                  globalStyles.sectionBox,
                  {
                    backgroundColor: colors.gray,
                    borderRadius: 40,
                  },
                ]}
              >
                <View
                  style={{
                    paddingVertical: 2,
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Feather name="copy" size={16} color={colors.accent} />
                  <Text
                    style={{
                      fontWeight: 700,
                      fontSize: ms(12),
                      color: colors.accent,
                    }}
                  >
                    Copy
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          <View style={globalStyles.bottomContainer}>
            <Pressable
              onPress={() => setSelectedRoute("code")}
              style={[globalStyles.btn, { marginTop: vs(30), width: "100%" }]}
            >
              <Text style={globalStyles.btnText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default AppSecurity;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingVertical: vs(20),
    paddingHorizontal: s(20),
    backgroundColor: colors.primary,
  },
});
