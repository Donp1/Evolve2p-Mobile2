import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "@/constants";
import { globalStyles } from "@/utils/globalStyles";
import { router } from "expo-router";
import { ms } from "react-native-size-matters";
import Switch from "@/components/Switch";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAlert } from "@/components/AlertService";

const goBack = () => {
  if (router.canGoBack()) router.back();
};

const Notification = () => {
  const [loading, setLoading] = useState(false);
  const [loginAlert, setLoginAlert] = useState<boolean>(false);
  const [txAlertEmail, setTxAlertEmail] = useState<boolean>(false);
  const [txAlertPush, setTxAlertPush] = useState<boolean>(false);

  const { AlertComponent, showAlert } = useAlert();

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleUpdate = async () => {
    setLoading(true);

    await sleep(2000); // wait 5 seconds

    setLoading(false);
    showAlert(
      "Success",
      "Settings updated successfully",
      [{ text: "Ok", onPress() {} }],
      "success"
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
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
          >
            Notification
          </Text>
        </Pressable>
        {loading ? (
          <View style={{ paddingHorizontal: 15 }}>
            <ActivityIndicator size="large" color="#4caf50" />
          </View>
        ) : (
          <Pressable style={{ paddingVertical: 10 }} onPress={handleUpdate}>
            <Text
              style={{
                fontSize: ms(14),
                fontWeight: 700,
                color: colors.accent,
                paddingHorizontal: 15,
              }}
            >
              Save
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ flex: 1, backgroundColor: colors.primary }}
      >
        <View style={{ paddingHorizontal: 15, marginVertical: 20 }}>
          <Text
            style={{
              fontWeight: 400,
              color: colors.secondary,
              fontSize: ms(14),
            }}
          >
            Login Alerts
          </Text>
          <View style={globalStyles.sectionBox}>
            <View style={[globalStyles.sectionMain, { paddingVertical: 5 }]}>
              <Text
                style={{
                  fontWeight: 400,
                  color: colors.secondary,
                  fontSize: ms(14),
                }}
              >
                Email
              </Text>
              <Switch isEnabled={loginAlert} setIsEnabled={setLoginAlert} />
            </View>
          </View>

          <View style={globalStyles.divider}></View>

          <Text
            style={{
              fontWeight: 400,
              color: colors.secondary,
              fontSize: ms(14),
              marginTop: 10,
            }}
          >
            Transactions Alerts
          </Text>
          <View style={globalStyles.sectionBox}>
            <View style={[globalStyles.sectionMain, { paddingVertical: 5 }]}>
              <Text
                style={{
                  fontWeight: 400,
                  color: colors.secondary,
                  fontSize: ms(14),
                }}
              >
                Email
              </Text>
              <Switch isEnabled={txAlertEmail} setIsEnabled={setTxAlertEmail} />
            </View>
          </View>
          <View style={globalStyles.sectionBox}>
            <View style={[globalStyles.sectionMain, { paddingVertical: 5 }]}>
              <Text
                style={{
                  fontWeight: 400,
                  color: colors.secondary,
                  fontSize: ms(14),
                }}
              >
                Push Notification
              </Text>
              <Switch isEnabled={txAlertPush} setIsEnabled={setTxAlertPush} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({});
