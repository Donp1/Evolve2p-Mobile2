import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { ms, vs } from "react-native-size-matters";
import { router } from "expo-router";

import { colors } from "@/constants";
import { globalStyles } from "@/utils/globalStyles";
import { getSettings } from "@/utils/countryStore";
import { useAlert } from "@/components/AlertService";

const TransactionLimit = () => {
  const [selectedMenu, setSelectedMenu] = useState<"withdraw" | "deposit">(
    "withdraw"
  );
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { AlertComponent, showAlert } = useAlert();

  /** Back navigation memoized */
  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
  }, []);

  /** Fetch settings only once */
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const res = await getSettings();

        if (!isMounted) return;

        if (res?.error) {
          showAlert(
            "Error",
            res?.message,
            [{ text: "Ok", onPress() {} }],
            "error"
          );
        } else if (res?.success) {
          setSettings(res.settings);
        }
      } catch (e) {
        showAlert(
          "Error",
          "Something went wrong.",
          [{ text: "Ok", onPress() {} }],
          "error"
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [showAlert]);

  const limits = useMemo(() => {
    if (!settings) return null;

    const daily =
      selectedMenu === "withdraw"
        ? settings.withdrawalLimit
        : settings.depositLimit;
    const monthly = Number(daily) * 30;

    return { daily, monthly };
  }, [settings, selectedMenu]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      {AlertComponent}

      {/* Top Bar */}
      <View style={globalStyles.topBar}>
        <Pressable onPress={goBack} style={styles.backButton}>
          <FontAwesome name="chevron-left" color={colors.secondary} size={15} />
          <Text style={styles.title}>Transaction Limits</Text>
        </Pressable>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Tabs */}
          <View style={styles.topMenu}>
            {["withdraw", "deposit"].map((menu) => (
              <Pressable
                key={menu}
                onPress={() => setSelectedMenu(menu as "withdraw" | "deposit")}
                style={[
                  styles.topMenuSection,
                  selectedMenu === menu && { backgroundColor: colors.gray },
                ]}
              >
                <Text
                  style={[
                    styles.menuText,
                    {
                      color:
                        selectedMenu === menu
                          ? colors.white2
                          : colors.secondary,
                      fontWeight: selectedMenu === menu ? "500" : "400",
                    },
                  ]}
                >
                  {menu === "withdraw" ? "Withdrawal" : "Deposit"}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Info Header */}
          <Text style={styles.header}>
            {selectedMenu.charAt(0).toUpperCase() + selectedMenu.slice(1)}{" "}
            Limits
          </Text>
          <Text style={styles.subHeader}>
            {selectedMenu === "withdraw"
              ? "Limits for sending money from balances to any recipient"
              : "Limits for making payments into balances"}
          </Text>

          {/* Limits */}
          {limits && (
            <>
              <LimitCard label="Daily Limit" amount={limits.daily} />
              <View style={globalStyles.divider} />
              <LimitCard label="Monthly Limit" amount={limits.monthly} />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/** Reusable limit card */
const LimitCard = React.memo(
  ({ label, amount }: { label: string; amount: number }) => (
    <View style={globalStyles.sectionBox}>
      <Text style={styles.limitText}>
        {label}: ${amount.toLocaleString()}
      </Text>
      <View style={styles.progressBar}>
        <View style={styles.progress} />
      </View>
      <View style={styles.limitFooter}>
        <Text style={styles.limitSmallText}>$14,850,000 remaining</Text>
        <Text style={styles.limitSmallText}>Refreshes in 10 minutes</Text>
      </View>
    </View>
  )
);

export default React.memo(TransactionLimit);

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  backButton: {
    padding: 15,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  title: {
    lineHeight: 24,
    fontWeight: "500",
    fontSize: ms(16),
    color: colors.secondary,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.primary,
  },
  content: {
    paddingHorizontal: 15,
    marginVertical: 20,
  },
  topMenu: {
    height: vs(56),
    borderRadius: 56,
    backgroundColor: colors.gray2,
    marginBottom: 30,
    width: "100%",
    padding: 5,
    flexDirection: "row",
  },
  topMenuSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 56,
  },
  menuText: {
    fontSize: ms(16),
  },
  header: {
    fontWeight: "700",
    fontSize: ms(20),
    color: colors.white2,
    marginBottom: 5,
  },
  subHeader: {
    fontWeight: "400",
    fontSize: ms(16),
    color: colors.white,
    marginBottom: 20,
  },
  limitText: {
    fontWeight: "500",
    fontSize: ms(14),
    color: colors.white2,
  },
  progressBar: {
    marginVertical: 10,
    backgroundColor: colors.gray,
    height: vs(8),
    borderRadius: 4,
    overflow: "hidden",
  },
  progress: {
    backgroundColor: colors.accent,
    width: "20%",
    height: vs(8),
  },
  limitFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  limitSmallText: {
    fontWeight: "400",
    fontSize: ms(12),
    color: colors.white,
  },
});
