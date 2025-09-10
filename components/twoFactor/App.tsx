import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { globalStyles } from "@/utils/globalStyles";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "@/constants";
import { router } from "expo-router";
import { ms, s, vs } from "react-native-size-matters";
import { Image } from "expo-image";
import { useAlert } from "../AlertService";
import { getItemAsync } from "expo-secure-store";
import { generate2fa, getUser, updateUser } from "@/utils/countryStore";
import { set } from "lodash";
import Spinner from "../Spinner";
import { useUserStore } from "@/store/userStore";

interface pageProps {
  selectedRoute: string;
  setSelectedRoute: Dispatch<SetStateAction<string>>;
  selectedMethod: string;
  setSelectedMethod: Dispatch<SetStateAction<string>>;
  setQrd: Dispatch<SetStateAction<string>>;
  setSecret: Dispatch<SetStateAction<string>>;
}
const App = ({
  selectedRoute,
  setSelectedRoute,
  selectedMethod,
  setSelectedMethod,
  setQrd,
  setSecret,
}: pageProps) => {
  const [loading, setLoading] = useState(false);

  const { AlertComponent, showAlert } = useAlert();
  const user = useUserStore((state: any) => state.user);
  const setUser = useUserStore((state: any) => state.setUser);

  const goBack = () => {
    setSelectedRoute("methods");
  };

  const handleMethodSelection = async () => {
    setLoading(true);
    try {
      if (user?.authType == "app" && user?.is2faEnabled) {
        showAlert(
          "error",
          "You already have 2FA enabled with the app method",
          [{ text: "close", onPress: () => {} }],
          "error"
        );
        return;
      }

      const res = await generate2fa();
      if (res?.success) {
        setQrd(res?.qrCode);
        setSecret(res?.secret);

        const updated = await updateUser({
          authType: "app",
        });
        if (updated.error) {
          console.log(updated.message);
          return;
        }
        const newUser = await getUser();
        if (newUser.error) {
          console.log(newUser.message);
          return;
        }

        setUser(newUser.user);
        setSelectedRoute("app-security");
      } else {
        showAlert(
          "error",
          res?.message,
          [{ text: "close", onPress: () => {} }],
          "error"
        );
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {AlertComponent}
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

      <View style={styles.content}>
        <Text
          style={{
            fontSize: ms(20),
            fontWeight: 700,
            color: colors.white2,
            marginBottom: vs(10),
          }}
        >
          Two Factor Authentication
        </Text>

        <View style={globalStyles.sectionBox}>
          <View
            style={[globalStyles.sectionMain, { gap: 10, paddingVertical: 5 }]}
          >
            <Image
              source={require("@/assets/images/authorized.png")}
              priority={"high"}
              contentFit="contain"
              style={{ width: 16, height: 16 }}
            />

            <View
              style={{
                flexDirection: "column",
                gap: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: ms(14),
                    fontWeight: 500,
                    color: colors.secondary,
                    lineHeight: vs(20),
                  }}
                >
                  Security App
                </Text>
                <View
                  style={{
                    backgroundColor: "#3A3A3A",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 16,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: ms(12),
                      color:
                        user?.authType == "app" ? colors.accent : "#66B9FF",
                    }}
                  >
                    {user?.authType == "app" ? "Enabled" : "Recommended"}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontSize: ms(12),
                  fontWeight: 400,
                  color: colors.secondary,
                }}
              >
                You'll use a verification code generated by a {"\n"}secure app
                like Authy or Google Authenticator
              </Text>
            </View>

            {/* <FontAwesome name="chevron-right" color={colors.white} size={15} /> */}
          </View>
        </View>

        <View style={[globalStyles.bottomContainer, { paddingBottom: 20 }]}>
          <Pressable
            // disabled={selectedMethod == "app"}
            onPress={handleMethodSelection}
            style={[
              globalStyles.btn,
              { width: "100%" },
              user?.authType == "app" && {
                opacity: 0.5,
                backgroundColor: colors.gray,
              },
            ]}
          >
            {loading ? (
              <Spinner width={20} height={20} />
            ) : (
              <Text
                style={[
                  globalStyles.btnText,
                  user?.authType == "app" && { color: colors.white },
                ]}
              >
                Change 2FA Method
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: vs(20),
    paddingHorizontal: s(20),
  },
});
