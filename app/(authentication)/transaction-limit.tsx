import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { globalStyles } from "@/utils/globalStyles";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "@/constants";
import { ms, vs } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";

const TransactionLimit = () => {
  const [selectedMenu, setSelectedMenu] = useState("withdraw");
  const goBack = () => {
    if (router.canGoBack()) router.back();
  };
  return (
    <SafeAreaView style={globalStyles.container}>
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
            Transaction Limits
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.primary }}
      >
        <View style={{ paddingHorizontal: 15, marginVertical: 20 }}>
          <View style={styles.topMenu}>
            <Pressable
              onPress={() => setSelectedMenu("withdraw")}
              style={[
                styles.topMenuSection,
                selectedMenu == "withdraw" && { backgroundColor: colors.gray },
              ]}
            >
              <Text
                style={{
                  fontWeight: selectedMenu == "withdraw" ? 500 : 400,
                  fontSize: ms(16),
                  color:
                    selectedMenu == "withdraw"
                      ? colors.white2
                      : colors.secondary,
                }}
              >
                Withdrawal
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSelectedMenu("deposite")}
              style={[
                styles.topMenuSection,
                selectedMenu == "deposite" && { backgroundColor: colors.gray },
              ]}
            >
              <Text
                style={{
                  fontWeight: selectedMenu == "deposite" ? 500 : 400,
                  fontSize: ms(16),
                  color:
                    selectedMenu == "deposite"
                      ? colors.white2
                      : colors.secondary,
                }}
              >
                Deposite
              </Text>
            </Pressable>
          </View>
          <Text
            style={{
              fontWeight: 700,
              fontSize: ms(20),
              color: colors.white2,
              marginBottom: 5,
            }}
          >
            {selectedMenu.charAt(0).toUpperCase() + selectedMenu.slice(1)}{" "}
            Limits
          </Text>
          <Text
            style={{
              fontWeight: 400,
              fontSize: ms(16),
              color: colors.white,
              marginBottom: 20,
            }}
          >
            {selectedMenu == "withdraw"
              ? "Limits for sending money from balances to any recipient"
              : "Limits for making payments into balances"}
          </Text>

          <View style={globalStyles.sectionBox}>
            <Text
              style={{
                fontWeight: 500,
                fontSize: ms(14),
                color: colors.white2,
              }}
            >
              Daily Limit: $148500
            </Text>
            <View style={styles.progressBar}>
              <View style={styles.progress} />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: ms(12),
                  color: colors.white,
                }}
              >
                $14850000 remaining
              </Text>
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: ms(12),
                  color: colors.white,
                }}
              >
                Refresheds in 10 minutes
              </Text>
            </View>
          </View>
          <View style={globalStyles.divider} />
          <View style={globalStyles.sectionBox}>
            <Text
              style={{
                fontWeight: 500,
                fontSize: ms(14),
                color: colors.white2,
              }}
            >
              Monthly Limit: $14850000
            </Text>
            <View style={styles.progressBar}>
              <View style={styles.progress} />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: ms(12),
                  color: colors.white,
                }}
              >
                $14850000 remaining
              </Text>
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: ms(12),
                  color: colors.white,
                }}
              >
                Refresheds in 10 minutes
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionLimit;

const styles = StyleSheet.create({
  progressBar: {
    marginVertical: 10,
    backgroundColor: colors.gray,
    height: vs(8),
    borderRadius: 4,
    overflow: "hidden",
  },
  progress: {
    backgroundColor: colors.accent,
    width: 8,
    height: vs(8),
  },
  topMenu: {
    height: vs(56),
    borderRadius: 56,
    backgroundColor: colors.gray2,
    marginBottom: 30,
    width: "100%",
    padding: 5,
    overflow: "hidden",
    flexDirection: "row",
  },
  topMenuSection: {
    width: "50%",
    height: vs(48),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 56,
  },
  topMenuSectionText: {},
});
