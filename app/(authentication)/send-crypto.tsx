import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import * as Clipboard from "expo-clipboard";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants";
import { globalStyles } from "@/utils/globalStyles";
import { router, useLocalSearchParams } from "expo-router";
import { ms, s, vs } from "react-native-size-matters";
import QRCode from "react-native-qrcode-svg";
import { useUserStore } from "@/store/userStore";
import { formatWalletAddress, getUser, sendCrypto } from "@/utils/countryStore";
import { SafeAreaView } from "react-native-safe-area-context";
import Spinner from "@/components/Spinner";
import { useCoins, useCoinStore } from "@/context";
import { Image } from "expo-image";
import BottomSheet from "@/components/BottomSheet";
import { set } from "lodash";
import { useAlert } from "@/components/AlertService";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SecurityCheck from "@/components/SecurityCheck";

const goBack = () => {
  if (router.canGoBack()) router.back();
};

function calculatePercentageValue(percentage: number, value: number): number {
  return Number(Number((percentage / 100) * value).toFixed(6));
}

const SendCrypto = () => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("0");
  const [isCoinSheetVisible, setIsCoinSheetVisible] = useState(false);
  const [show2fa, setShow2fa] = useState(false);
  const [is2FaPassed, setIs2FaPassed] = useState(false);

  const { coin } = useLocalSearchParams();
  const [activeCoin, setActiveCoin] = useState(coin);

  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const coins = useCoinStore((state) => state.coins);

  const { AlertComponent, showAlert } = useAlert();

  const selectedCoin = coins.find(
    (c) => c.symbol.toLowerCase() === activeCoin?.toString().toLowerCase()
  );

  const selectedUserWallet = user?.wallets.find(
    (wallet: any) =>
      wallet.currency.toLowerCase() === activeCoin?.toString().toLowerCase()
  );

  const handleSendCrypto = async () => {
    setLoading(true);
    if (!address) {
      setLoading(false);
      showAlert(
        "Error",
        "Please enter a valid address or username.",
        [{ text: "OK", onPress() {} }],
        "error"
      );
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setLoading(false);
      showAlert(
        "Error",
        "Please enter a valid amount.",
        [{ text: "OK", onPress() {} }],
        "error"
      );
      return;
    }

    if (Number(amount) > Number(selectedUserWallet?.balance)) {
      setLoading(false);
      showAlert(
        "Error",
        "Amount is greater than your balance",
        [{ text: "OK", onPress() {} }],
        "error"
      );
      return;
    }

    if (!user?.kycVerified) {
      showAlert(
        "Not Verified",
        "You must complete KYC verification to send crypto. Please verify your identity.",
        [
          {
            text: "Close",
            onPress() {
              // router.push("/kycVerification");
            },
          },
          {
            text: "Verify",
            onPress() {
              router.push("/kycVerification");
            },
            style: { backgroundColor: colors.accent },
            textStyle: { color: "#000" },
          },
        ],
        "error"
      );
      setLoading(false);
      return;
    }

    try {
      const send = await sendCrypto(
        Array.isArray(activeCoin)
          ? activeCoin[0]?.toUpperCase()
          : activeCoin?.toString().toUpperCase(),
        Number(amount),
        address
      );
      setLoading(false);

      if (send?.success) {
        showAlert(
          "Success",
          send?.message,
          [{ text: "OK", onPress() {} }],
          "success"
        );

        setAmount("");
        setAddress("");

        // Update user data after sending crypto
        // This assumes getUser fetches the latest user data from the server
        // and updates the user store accordingly.
        const updatedUser = await getUser();

        if (updatedUser?.success) {
          setUser(updatedUser?.user);
        } else {
          showAlert(
            "Error",
            "Failed to update user data. Please try again.",
            [{ text: "OK", onPress() {} }],
            "error"
          );
        }
      } else {
        showAlert(
          "Error",
          `Failed to send ${activeCoin}. Error: ${send?.message}`,
          [{ text: "OK", onPress() {} }],
          "error"
        );
        alert();
      }
    } catch (error) {
      showAlert(
        "Error",
        "Error sending crypto: " + error,
        [{ text: "OK", onPress() {} }],
        "error"
      );
      console.error("Error sending crypto:", error);
      setLoading(false);
    }
  };

  const sendConfirm = async () => {
    if (!user?.is2faEnabled) {
      showAlert("Error", "Please setup 2FA authentication to continue", [
        { text: "Close", onPress() {} },
        {
          text: "Setup now",
          onPress() {
            router.push("/(authentication)/two-factor-auth");
          },
          style: { backgroundColor: colors.secondary },
          textStyle: { color: colors.primary },
        },
      ]);

      return;
    }

    setShow2fa(true);
  };

  useEffect(() => {
    (async () => {
      if (is2FaPassed) {
        await handleSendCrypto();
      }
    })();
  }, [is2FaPassed]);

  return (
    <>
      <SafeAreaView style={globalStyles.container}>
        {AlertComponent}
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid
          extraScrollHeight={20}
        >
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
              >
                Send {activeCoin?.toString().toUpperCase()}
              </Text>
            </Pressable>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: colors.primary,
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingBottom: 20,

                // height: "100%",
                flexGrow: 1,
                paddingHorizontal: 10,
              }}
            >
              <Pressable
                onPress={() => setIsCoinSheetVisible(true)}
                style={globalStyles.sectionBox}
              >
                <View
                  style={[globalStyles.sectionMain, { paddingVertical: 0 }]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{ width: ms(30), height: ms(30) }}
                      source={{ uri: selectedCoin?.image }}
                    />
                    <View>
                      <Text
                        style={{
                          fontWeight: 400,
                          fontSize: ms(12),
                          lineHeight: 18,
                          color: colors.secondary,
                        }}
                      >
                        Wallet Balance
                      </Text>
                      <Text
                        style={{
                          fontWeight: 500,
                          fontSize: ms(14),
                          lineHeight: 20,
                          color: colors.white2,
                        }}
                      >
                        {Number(selectedUserWallet?.balance).toFixed(5)}{" "}
                        {activeCoin?.toString().toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <FontAwesome name="chevron-down" color={colors.secondary} />
                </View>
              </Pressable>

              <View style={[globalStyles.form, { paddingTop: 20 }]}>
                <Text style={globalStyles.formLabel}>To</Text>
                <View style={[globalStyles.formInputContainer]}>
                  <TextInput
                    placeholder="Username or Address"
                    style={[
                      globalStyles.formInput,
                      { fontWeight: 500, color: colors.white2 },
                    ]}
                    inputMode="email"
                    placeholderTextColor={colors.white}
                    defaultValue={address}
                    onChangeText={(e) => setAddress(e)}
                  />
                </View>
              </View>

              <View style={[globalStyles.sectionBox, { paddingVertical: 10 }]}>
                <View
                  style={[globalStyles.sectionMain, { paddingVertical: 0 }]}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontWeight: 400,
                        fontSize: ms(14),
                        lineHeight: 20,
                        color: colors.gray3,
                      }}
                    >
                      You are sending
                    </Text>

                    <TextInput
                      keyboardType="decimal-pad"
                      style={{
                        width: "100%",
                        fontWeight: 700,
                        fontSize: ms(25),
                        color: colors.white2,
                      }}
                      placeholder="0"
                      placeholderTextColor={colors.gray3}
                      defaultValue={amount}
                      onChangeText={(e) => setAmount(e)}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontWeight: 400,
                        fontSize: ms(25),
                        color: colors.secondary,
                      }}
                    >
                      | {activeCoin?.toString().toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ height: ms(50), marginBottom: 20 }}>
                <ScrollView
                  contentContainerStyle={{
                    height: ms(50),
                  }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      justifyContent: "center",
                      alignSelf: "center",
                      width: "100%",
                    }}
                  >
                    <Pressable
                      onPress={() => {
                        setAmount(
                          calculatePercentageValue(
                            10,
                            Number(selectedUserWallet?.balance || 0)
                          ).toString()
                        );
                      }}
                      style={{ width: s(60), alignSelf: "flex-end" }}
                    >
                      <View
                        style={[
                          globalStyles.sectionBox,
                          {
                            alignItems: "center",
                            justifyContent: "center",
                            // backgroundColor: colors.accent,
                            borderRadius: 100,
                          },
                        ]}
                      >
                        <Text
                          style={{ color: colors.secondary, fontWeight: 700 }}
                        >
                          10%
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setAmount(
                          calculatePercentageValue(
                            25,
                            Number(selectedUserWallet?.balance || 0)
                          ).toString()
                        );
                      }}
                      style={{ width: s(60), alignSelf: "flex-end" }}
                    >
                      <View
                        style={[
                          globalStyles.sectionBox,
                          {
                            alignItems: "center",
                            justifyContent: "center",
                            // backgroundColor: colors.accent,
                            borderRadius: 100,
                          },
                        ]}
                      >
                        <Text
                          style={{ color: colors.secondary, fontWeight: 700 }}
                        >
                          25%
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setAmount(
                          calculatePercentageValue(
                            50,
                            Number(selectedUserWallet?.balance || 0)
                          ).toString()
                        );
                      }}
                      style={{ width: s(60), alignSelf: "flex-end" }}
                    >
                      <View
                        style={[
                          globalStyles.sectionBox,
                          {
                            alignItems: "center",
                            justifyContent: "center",
                            // backgroundColor: colors.accent,
                            borderRadius: 100,
                          },
                        ]}
                      >
                        <Text
                          style={{ color: colors.secondary, fontWeight: 700 }}
                        >
                          50%
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setAmount(
                          calculatePercentageValue(
                            75,
                            Number(selectedUserWallet?.balance || 0)
                          ).toString()
                        );
                      }}
                      style={{ width: s(60), alignSelf: "flex-end" }}
                    >
                      <View
                        style={[
                          globalStyles.sectionBox,
                          {
                            alignItems: "center",
                            justifyContent: "center",
                            // backgroundColor: colors.accent,
                            borderRadius: 100,
                          },
                        ]}
                      >
                        <Text
                          style={{ color: colors.secondary, fontWeight: 700 }}
                        >
                          75%
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setAmount(
                          calculatePercentageValue(
                            100,
                            Number(selectedUserWallet?.balance || 0)
                          ).toString()
                        );
                      }}
                      style={{ width: s(60), alignSelf: "flex-end" }}
                    >
                      <View
                        style={[
                          globalStyles.sectionBox,
                          {
                            alignItems: "center",
                            justifyContent: "center",
                            // backgroundColor: colors.accent,
                            borderRadius: 100,
                          },
                        ]}
                      >
                        <Text
                          style={{ color: colors.secondary, fontWeight: 700 }}
                        >
                          Max
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                </ScrollView>
              </View>

              <View
                style={[
                  globalStyles.sectionBox,
                  {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderLeftWidth: 2,
                    borderLeftColor: "#FFC051",
                    gap: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    // justifyContent: "center"
                  },
                ]}
              >
                <FontAwesome
                  name="info-circle"
                  color={"#FFC051"}
                  size={ms(14)}
                />
                <Text
                  style={{
                    fontSize: ms(14),
                    color: colors.secondary,
                    fontWeight: 400,
                    lineHeight: 20,
                  }}
                >
                  Only send [{activeCoin.toString().toUpperCase()}] to a{" "}
                  {["USDT", "USDC"].includes(
                    activeCoin.toString().toUpperCase()
                  )
                    ? "TRON"
                    : activeCoin.toString().toUpperCase()}
                  -compatible wallet address. Using the wrong address may lead
                  to permanent loss.
                </Text>
              </View>

              <View style={[globalStyles.bottomContainer]}>
                <Pressable
                  onPress={sendConfirm}
                  disabled={
                    loading || !amount || !(Number(amount) > 0) || !address
                  }
                  style={[
                    globalStyles.btn,
                    (loading ||
                      !amount ||
                      !(Number(amount) > 0) ||
                      !address) && {
                      opacity: 0.5,
                    },
                  ]}
                >
                  {loading ? (
                    <Spinner height={20} width={20} />
                  ) : (
                    <Text style={globalStyles.btnText}>
                      Send {activeCoin.toString().toUpperCase()}
                    </Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>

      <BottomSheet
        visible={isCoinSheetVisible}
        setVisible={setIsCoinSheetVisible}
        height={vs(50)}
      >
        <Text
          style={{
            fontWeight: 500,
            fontSize: ms(16),
            lineHeight: 28,
            color: colors.white,
            marginTop: 20,
          }}
        >
          Select a Coin
        </Text>
        {coins.map((coin, index) => (
          <Pressable
            onPress={() => {
              setActiveCoin(coin.symbol);
              setIsCoinSheetVisible(false);
              setAddress("");
              setAmount("0");
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
                  {coin.name}
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
      </BottomSheet>

      <SecurityCheck
        setPassed={setIs2FaPassed}
        setVisible={setShow2fa}
        visible={show2fa}
      />
    </>
  );
};

export default SendCrypto;

const styles = StyleSheet.create({
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
});
