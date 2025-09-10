import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { globalStyles } from "@/utils/globalStyles";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "@/constants";
import { router } from "expo-router";
import { ms, s, vs } from "react-native-size-matters";
import { Image } from "expo-image";
import { useUserStore } from "@/store/userStore";

interface pageProps {
  selectedRoute: string;
  setSelectedRoute: Dispatch<SetStateAction<string>>;
  selectedMethod: string;
}
const Methods = ({
  selectedRoute,
  setSelectedRoute,
  selectedMethod,
}: pageProps) => {
  const goBack = () => {
    if (router.canGoBack()) router.back();
  };

  const user = useUserStore((state: any) => state.user);
  return (
    <>
      <View style={globalStyles.topBar}>
        <Pressable
          onPress={() => setSelectedRoute("home")}
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
          >
            Two Factor Authentication
          </Text>
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
          Choose Your 2FA Method
        </Text>
        <Text
          style={{
            fontSize: ms(14),
            fontWeight: 400,
            color: colors.white,
            lineHeight: vs(20),
            marginBottom: 20,
          }}
        >
          Select how you want to receive your verification codes.
        </Text>

        <Pressable
          disabled={user?.authType == "app"}
          onPress={() => setSelectedRoute("app")}
          style={[
            globalStyles.sectionBox,
            user?.authType == "app" && { opacity: 0.5 },
            { marginTop: 20 },
          ]}
        >
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
                Use an authenticator app like Authy or {"\n"}Google
                Authenticator.
              </Text>
            </View>

            <FontAwesome name="chevron-right" color={colors.white} size={15} />
          </View>
        </Pressable>

        <Pressable
          disabled={user?.authType == "sms"}
          onPress={() => setSelectedRoute("sms")}
          style={[
            globalStyles.sectionBox,
            user?.authType == "sms" && { opacity: 0.5 },
            { marginTop: 20 },
          ]}
        >
          <View style={globalStyles.sectionMain}>
            <Image
              source={require("@/assets/images/elements.png")}
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
                  SMS Authentication
                </Text>
                {user?.authType == "sms" && (
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
                          user?.authType == "sms" ? colors.accent : "#66B9FF",
                      }}
                    >
                      {user?.authType == "sms" ? "Enabled" : "Recommended"}
                    </Text>
                  </View>
                )}
              </View>

              <Text
                style={{
                  fontSize: ms(12),
                  fontWeight: 400,
                  color: colors.secondary,
                }}
              >
                Receive codes via text message.
              </Text>
            </View>
            <FontAwesome name="chevron-right" color={colors.white} size={15} />
          </View>
        </Pressable>
      </View>
    </>
  );
};

export default Methods;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: vs(20),
    paddingHorizontal: s(20),
  },
});
