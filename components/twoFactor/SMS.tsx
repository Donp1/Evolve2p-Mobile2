import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { globalStyles } from "@/utils/globalStyles";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "@/constants";
import { router } from "expo-router";
import { ms, s, vs } from "react-native-size-matters";
import { Image } from "expo-image";
import { useUserStore } from "@/store/userStore";
import { getUser, updateUser } from "@/utils/countryStore";
import { useAlert } from "../AlertService";
import { set } from "lodash";
import Spinner from "../Spinner";

interface pageProps {
  selectedRoute: string;
  setSelectedRoute: Dispatch<SetStateAction<string>>;
  selectedMethod: string;
  setSelectedMethod: Dispatch<SetStateAction<string>>;
}
const SMS = ({
  selectedRoute,
  setSelectedRoute,
  selectedMethod,
  setSelectedMethod,
}: pageProps) => {
  const goBack = () => {
    setSelectedRoute("methods");
  };

  const user = useUserStore((state) => state.user);
  const { AlertComponent, showAlert } = useAlert();

  const [loading, setLoading] = React.useState(false);
  const setUser = useUserStore((state) => state.setUser);

  const handle2faChange = async () => {
    setLoading(true);
    const res = await updateUser({ authType: "sms" });
    if (res?.error) {
      showAlert(
        "Error",
        res?.message,
        [{ text: "OK", onPress: () => {} }],
        "error"
      );
      setLoading(false);
      return;
    }

    if (res?.success) {
      const newUser = await getUser();
      if (newUser.error) {
        showAlert(
          "Error",
          newUser?.message,
          [{ text: "OK", onPress: () => {} }],
          "error"
        );
        setLoading(false);
        return;
      }

      setUser(newUser.user);
      showAlert(
        "Success",
        "Two Factor Authentication method changed to SMS.",
        [{ text: "OK", onPress: () => setSelectedRoute("methods") }],
        "success"
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
          Two Factor Authentication
        </Text>

        <View style={[globalStyles.sectionBox, { marginTop: 20 }]}>
          <View style={globalStyles.sectionMain}>
            <Image
              source={require("@/assets/images/elements.png")}
              priority={"high"}
              contentFit="contain"
              style={{ width: 16, height: 16 }}
            />
            <View style={{}}>
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
        </View>

        <View style={[globalStyles.bottomContainer, { paddingBottom: 20 }]}>
          <Pressable
            disabled={user?.authType == "sms"}
            onPress={handle2faChange}
            style={[
              globalStyles.btn,
              { width: "100%" },
              user?.authType == "sms" && {
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
                  user?.authType == "sms" && { color: colors.white },
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

export default SMS;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: vs(20),
    paddingHorizontal: s(20),
    backgroundColor: colors.primary,
  },
});
