import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { act, useCallback, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { globalStyles } from "@/utils/globalStyles";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { colors } from "@/constants";
import { ms, s, vs } from "react-native-size-matters";
import {
  AntDesign,
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useCoins, useCoinStore } from "@/context";
import {
  getCoinPrice,
  getRecentActions,
  getUsdValue,
  getUser,
} from "@/utils/countryStore";
import { Image } from "expo-image";
import Spinner from "@/components/Spinner";
import { getItemAsync } from "expo-secure-store";
import PreferedCurrency, {
  SelectedCurrency,
} from "@/components/PreferedCurrency";
import StoryBox from "@/components/Storybox";
import GridComponent from "@/components/GridComponent";
import BottomSheet from "@/components/BottomSheet";
import { router } from "expo-router";
import { set } from "lodash";
import { useUserStore } from "@/store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";
import BalanceViewer from "@/components/BalanceViewer";
import Assets from "@/components/Assets";
import { useAlert } from "@/components/AlertService";
import NotificationView from "@/components/NotificationView";

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export interface homeContent {
  icon: React.ReactNode;
  heading: string;
  description: string;
}

const formatDateTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export function formatAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

const Wallet = () => {
  const [coinLoading, setCoinLoading] = React.useState(false);
  const [lockCurrency, setLockCurrency] = useState(false);
  const [myBalances, setMyBalances] = useState<
    { crypto: string; amount: number }[]
  >([]);

  const [completeKycVisible, setCompleteKycVisible] = useState(false);

  const [cryptoAction, setCryptoAction] = useState("");
  const [isCryptoBoxVisible, setIsCryptoBoxVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [actions, setActions] = useState<any[]>([]);

  const user = useUserStore((state: any) => state.user);
  const { coins, fetchCoins, loading, error } = useCoinStore();

  const { AlertComponent, showAlert } = useAlert();

  useEffect(() => {
    if (coins.length === 0) {
      fetchCoins(); // only fetch once (caching logic)
    }
  }, []);

  useEffect(() => {
    const recentActions = getRecentActions(user);
    setActions(recentActions);
    // console.log(user?.swaps);
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCoins(); // just refetch data instead of full reload
    setRefreshing(false);
  }, [fetchCoins]);

  const handleSendCrypto = () => {
    if (user?.status == "SUSPENDED") {
      showAlert(
        "Account Suspended",
        "Your account has been suspended. Please contact support for assistance.",
        [
          //  {
          //    text: "Set Now",
          //    onPress() {
          //      router.push("/(authentication)/");
          //    },
          //    style: { backgroundColor: colors.accent },
          //    textStyle: { color: colors.primary },
          //  },
          {
            text: "Close",
            onPress() {},
          },
        ],
        "error"
      );
      return;
    }

    if (!user?.kycVerified) {
      showAlert(
        "Not Verified",
        "KYC verification required. Please complete your verification to continue.",
        [
          {
            text: "Verify Now",
            onPress() {
              router.push("/kycVerification");
            },
            style: { backgroundColor: colors.accent },
            textStyle: { color: colors.primary },
          },
          {
            text: "Close",
            onPress() {},
          },
        ],
        "error"
      );
      return;
    }

    if (!user?.is2faEnabled) {
      showAlert(
        "Not set 2FA",
        "Two-Factor Authentication (2FA) is required before performing this action. Please enable 2FA in your account settings.",
        [
          {
            text: "Set Now",
            onPress() {
              router.push("/(authentication)/two-factor-auth");
            },
            style: { backgroundColor: colors.accent },
            textStyle: { color: colors.primary },
          },
          {
            text: "Close",
            onPress() {},
          },
        ],
        "error"
      );
      return;
    }

    setCryptoAction("Send");
    setIsCryptoBoxVisible(true);
  };

  const handleRecieveCrypto = () => {
    if (user?.status == "SUSPENDED") {
      showAlert(
        "Account Suspended",
        "Your account has been suspended. Please contact support for assistance.",
        [
          //  {
          //    text: "Set Now",
          //    onPress() {
          //      router.push("/(authentication)/");
          //    },
          //    style: { backgroundColor: colors.accent },
          //    textStyle: { color: colors.primary },
          //  },
          {
            text: "Close",
            onPress() {},
          },
        ],
        "error"
      );
      return;
    }
    setCryptoAction("Receive");
    setIsCryptoBoxVisible(true);
  };

  const handleSwapCrypto = () => {
    if (user?.status == "SUSPENDED") {
      showAlert(
        "Account Suspended",
        "Your account has been suspended. Please contact support for assistance.",
        [
          //  {
          //    text: "Set Now",
          //    onPress() {
          //      router.push("/(authentication)/");
          //    },
          //    style: { backgroundColor: colors.accent },
          //    textStyle: { color: colors.primary },
          //  },
          {
            text: "Close",
            onPress() {},
          },
        ],
        "error"
      );
      return;
    }
    router.push("/swap");
  };

  return (
    <SafeAreaView style={[globalStyles.container]}>
      {AlertComponent}
      <View style={[globalStyles.topBar, { padding: 10 }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text
            style={{ fontSize: ms(14), fontWeight: 400, color: colors.gray3 }}
          >
            Wallet
          </Text>
        </View>

        <NotificationView />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: colors.primary,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          {!user?.kycVerified && (
            <Pressable
              onPress={() => setCompleteKycVisible((c) => !c)}
              style={styles.kycBox}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <MaterialIcons name="error" size={ms(16)} color="#F5918A" />
                <Text
                  style={{
                    flex: 1,
                    color: colors.secondary,
                    fontSize: ms(12),
                    fontWeight: 500,
                  }}
                >
                  Complete KYC and enjoy access to all features available on the
                  app.
                </Text>
                <Entypo
                  name="chevron-small-right"
                  size={ms(16)}
                  color={colors.white}
                />
              </View>
            </Pressable>
          )}

          <BalanceViewer
            lockCurrency={lockCurrency}
            setLockCurrency={setLockCurrency}
            refreshing={refreshing}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 30,
              marginBottom: 20,
            }}
          >
            <Pressable
              onPress={handleSendCrypto}
              style={[
                globalStyles.sectionBox,
                {
                  flex: 1,
                  height: vs(80),
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                },
              ]}
            >
              <Feather name="send" size={25} color={colors.accent} />
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: ms(12),
                  color: colors.white,
                }}
              >
                Send
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleRecieveCrypto()}
              style={[
                globalStyles.sectionBox,
                {
                  flex: 1,
                  height: vs(80),
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="arrow-bottom-right"
                size={24}
                color={colors.accent}
              />
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: ms(12),
                  color: colors.white,
                }}
              >
                Receive
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleSwapCrypto()}
              style={[
                globalStyles.sectionBox,
                {
                  flex: 1,
                  height: vs(80),
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                },
              ]}
            >
              <Image
                source={require("@/assets/images/swap.png")}
                style={{ width: ms(20), height: ms(20) }}
                contentFit="contain"
              />
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: ms(12),
                  color: colors.white,
                }}
              >
                Swap
              </Text>
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{ fontWeight: 500, fontSize: ms(16), color: colors.white }}
            >
              Your Assets
            </Text>
          </View>

          <Assets lockCurrency={lockCurrency} />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 10,
            }}
          >
            <Text
              style={{ fontWeight: 500, fontSize: ms(16), color: colors.white }}
            >
              Transactions
            </Text>
            <FontAwesome
              name="long-arrow-right"
              size={ms(16)}
              color={colors.secondary}
            />
          </View>

          {actions.length <= 0 ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: vs(200),
                gap: 20,
              }}
            >
              <Image
                source={require("@/assets/images/tx-settings.png")}
                style={{ width: ms(80), height: ms(80) }}
                contentFit="contain"
              />
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: ms(14),
                  color: colors.white,
                }}
              >
                Your 10 most recent transactions will appear here
              </Text>
            </View>
          ) : (
            <>
              {actions.map((action, index) => (
                <View key={index} style={globalStyles.sectionBox}>
                  <View style={[globalStyles.sectionMain, { gap: 10 }]}>
                    <View>
                      {action?.section == "transaction" ? (
                        action?.type == "TRANSFER" ||
                        action?.type == "INTERNAL_TRANSFER" ? (
                          <View
                            style={{
                              backgroundColor: "black",
                              borderRadius: 15,
                              width: 30,
                              height: 30,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <MaterialCommunityIcons
                              name="arrow-top-right-thin"
                              size={20}
                              color={colors.white2}
                            />
                          </View>
                        ) : (
                          <View
                            style={{
                              backgroundColor: "black",
                              borderRadius: 15,
                              width: 30,
                              height: 30,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <MaterialCommunityIcons
                              name="arrow-bottom-right-thin"
                              size={20}
                              color={colors.white2}
                            />
                          </View>
                        )
                      ) : action?.section == "swap" ? (
                        <View
                          style={{
                            backgroundColor: "black",
                            borderRadius: 15,
                            width: 30,
                            height: 30,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ionicons
                            name="reload-outline"
                            size={20}
                            color={colors.white2}
                          />
                        </View>
                      ) : null}
                    </View>
                    {/* end icon view */}

                    <View style={{ flex: 1, gap: 5 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        {action?.type == "TRANSFER" ||
                        action?.type == "INTERNAL_TRANSFER" ? (
                          <Text
                            style={{
                              fontSize: ms(12),
                              fontWeight: 500,
                              color: colors.white2,
                            }}
                          >
                            Sent to @{formatAddress(action?.toAddress)}
                          </Text>
                        ) : action?.type == "DEPOSIT" ? (
                          <Text
                            style={{
                              fontSize: ms(12),
                              fontWeight: 500,
                              color: colors.white2,
                            }}
                          >
                            Received from @{formatAddress(action?.toAddress)}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontSize: ms(12),
                              fontWeight: 500,
                              color: colors.white2,
                            }}
                          >
                            Swapped {action?.fromCoin} to {action?.toCoin}
                          </Text>
                        )}
                        <Text
                          style={{
                            fontSize: ms(12),
                            fontWeight: 500,
                            color: colors.white2,
                          }}
                        >
                          {action?.section == "transaction"
                            ? Number(action?.amount).toFixed(5)
                            : Number(action?.toAmount).toFixed(5)}
                        </Text>
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
                            color: colors.white,
                            fontSize: ms(12),
                            fontWeight: 500,
                          }}
                        >
                          {formatDateTime(action?.createdAt)}
                        </Text>
                        <View
                          style={{
                            backgroundColor: "#1B362B",
                            paddingHorizontal: 5,
                            paddingVertical: 3,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                            borderRadius: 100,
                          }}
                        >
                          <AntDesign
                            name="check-circle"
                            size={11}
                            color="#1ECB84"
                          />
                          <Text
                            style={{
                              color: "#1ECB84",
                              fontSize: ms(12),
                              fontWeight: 500,
                            }}
                          >
                            {action?.section == "transaction"
                              ? action?.status
                              : "COMPLETED"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* KYC VERIFICATION */}
      <BottomSheet
        setVisible={setCompleteKycVisible}
        visible={completeKycVisible}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <Image
            source={require("@/assets/images/user-x.png")}
            style={{ width: ms(54), height: ms(57) }}
            contentFit="contain"
            // transition={1000}
          />
          <Text
            style={{
              fontWeight: 700,
              fontSize: ms(20),
              lineHeight: 28,
              color: colors.white2,
              marginTop: 20,
            }}
          >
            Complete Your KYC to Continue
          </Text>
          <Text
            style={{
              fontWeight: 400,
              fontSize: ms(14),
              lineHeight: 20,
              color: colors.gray3,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Identity verification is required to access this feature and keep
            your account secure.
          </Text>
          <Pressable
            onPress={() => {
              setCompleteKycVisible(false);
              router.push("/kycVerification");
            }}
            style={[globalStyles.btn, { marginTop: 20 }]}
          >
            <Text
              style={[
                globalStyles.btnText,
                { fontSize: ms(14), fontWeight: 700 },
              ]}
            >
              Verify Now
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setCompleteKycVisible(false)}
            style={[
              globalStyles.btn,
              { marginTop: 20, backgroundColor: colors.gray2 },
            ]}
          >
            <Text
              style={[
                globalStyles.btnText,
                { fontSize: ms(14), fontWeight: 700, color: colors.white2 },
              ]}
            >
              Maybe Later
            </Text>
          </Pressable>
        </View>
      </BottomSheet>

      {/* SEND AND RECEIVE CRYPTO */}

      <BottomSheet
        setVisible={setIsCryptoBoxVisible}
        visible={isCryptoBoxVisible}
        height={60}
      >
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <Text
            style={{
              fontWeight: 500,
              fontSize: ms(16),
              lineHeight: 28,
              color: colors.white,
              marginTop: 20,
            }}
          >
            {cryptoAction != "" && cryptoAction == "Send"
              ? "Select Cryptocurrency to Send"
              : "Select Cryptocurrency to Receive"}
          </Text>

          <View style={{ marginTop: 20, gap: 10 }}>
            {coins.map((coin, index) => (
              <Pressable
                onPress={() => {
                  setIsCryptoBoxVisible(false);
                  if (cryptoAction == "Receive") {
                    router.push({
                      pathname: "/receive-crypto",
                      params: { coin: coin.symbol.toUpperCase() },
                    });
                  } else if (cryptoAction == "Send") {
                    router.push({
                      pathname: "/send-crypto",
                      params: { coin: coin.symbol.toUpperCase() },
                    });
                  }
                }}
                key={index}
                style={styles.coinContainer}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Image
                    source={{ uri: coin.image }}
                    style={{ width: ms(30), height: ms(30) }}
                    contentFit="contain"
                    transition={1000}
                  />
                  <View>
                    <Text
                      style={{
                        color: colors.white2,
                        fontSize: ms(14),
                        fontWeight: 700,
                      }}
                    >
                      {cryptoAction} {coin.name}
                    </Text>
                  </View>
                </View>
                <FontAwesome
                  name="chevron-right"
                  size={ms(16)}
                  color={colors.white}
                />
              </Pressable>
            ))}
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  notiContainer: {
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.white,
  },
  noti: {},
  kycBox: {
    width: "100%",
    backgroundColor: colors.gray2,
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 8,
    paddingVertical: 16,
    justifyContent: "space-between",
    borderLeftWidth: 2,
    borderLeftColor: "#F5918A",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  balance: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray2,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray2,
    marginVertical: 20,
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.gray2,
    borderRadius: 10,
    marginVertical: 8,
  },
  gridContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    // paddingHorizontal: 10,
    width: "100%",
    flexWrap: "wrap",
    gap: 10,
  },
});
