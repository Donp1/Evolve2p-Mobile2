import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { globalStyles } from "@/utils/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import { router } from "expo-router";
import BottomSheet from "@/components/BottomSheet";
import { useCoinPriceStore, useCoins, useCoinStore } from "@/context";
import { Image } from "expo-image";
import { useUserStore } from "@/store/userStore";
import {
  convertCurrency,
  getConversionRate,
  getLiveRate,
  getUser,
  swapToken,
} from "@/utils/countryStore";
import Spinner from "@/components/Spinner";
import { useAlert } from "@/components/AlertService";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Swap = () => {
  const goBack = () => {
    if (router.canGoBack()) router.back();
  };

  function formatUSD(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  const coins = useCoinStore((state) => state.coins);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state: any) => state.setUser);

  const [loading, setLoading] = useState(false);

  const [coinBottomSheet, setCoinBottomSheet] = useState(false);
  const [topCoin, setTopCoin] = useState(coins[0]);
  const [bottomCoin, setBottomCoin] = useState(coins[1]);
  const [position, setPosition] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("0");
  const [swapLoading, setSwapLoading] = useState(false);

  const [swapBottomSheet, setSwapBottomSheet] = useState(false);

  const [fromAmount, setFromAmount] = useState("0");
  const [rate, setRate] = useState(0);

  const { AlertComponent, showAlert } = useAlert();
  const fetchPrice = useCoinPriceStore((state) => state.fetchPrices);
  const prices = useCoinPriceStore((state) => state.prices);

  const handleSwap = async () => {
    if (!user?.kycVerified) {
      showAlert(
        "Not Verified",
        "You must complete KYC verification to swap crypto. Please verify your identity.",
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

    setSwapBottomSheet(true);
  };

  const handleConfirmSwap = async () => {
    setSwapLoading(true);

    try {
      const swapRes = await swapToken(
        topCoin?.symbol?.toUpperCase(),
        bottomCoin?.symbol?.toUpperCase(),
        fromAmount
      );

      if (swapRes?.error) {
        setSwapLoading(false);
        return showAlert(
          "Error",
          String(swapRes?.message),
          [{ text: "Ok", onPress() {} }],
          "error"
        );
      }

      if (swapRes?.success) {
        const user = await getUser();
        setUser(user.user);
        setSwapLoading(false);
        return showAlert(
          "Success",
          String(swapRes?.message),
          [
            {
              text: "Continue",
              onPress() {
                // router.push("/wallet");
                setSwapBottomSheet(false);
                setFromAmount("0");
                setConvertedAmount("0");
              },
            },
          ],
          "success"
        );
      }
    } catch (error) {
      console.log(error);
      showAlert(
        "Error",
        String(error),
        [{ text: "Ok", onPress() {} }],
        "error"
      );
      setSwapLoading(false);
    }
  };

  const boxWrapper = (leftText: string, rightText: string) => {
    return (
      <View
        style={[
          globalStyles.sectionBox,
          {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            paddingVertical: 0,
          },
        ]}
      >
        <View style={[globalStyles.sectionMain, { padding: 0 }]}>
          <Text
            style={{
              textAlign: "center",
              fontWeight: 400,
              fontSize: ms(14),
              color: colors.secondary,
            }}
          >
            {leftText}
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontWeight: 500,
              fontSize: ms(14),
              color: colors.white2,
            }}
          >
            {rightText}
          </Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchPrice();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const rate = await getLiveRate(
          topCoin?.symbol.toUpperCase(),
          bottomCoin?.symbol.toUpperCase(),
          prices
        );

        setRate(rate);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [topCoin, bottomCoin]);

  const topWallet = user?.wallets.find(
    (wallet: any) =>
      wallet.currency.toLowerCase() ===
      topCoin?.symbol?.toString().toLowerCase()
  );
  const bottomWallet = user?.wallets.find(
    (wallet: any) =>
      wallet.currency.toLowerCase() ===
      bottomCoin?.symbol?.toString().toLowerCase()
  );

  const switchCoins = () => {
    setFromAmount("0");
    setConvertedAmount("0");
    setTopCoin((prevFrom) => {
      setBottomCoin(prevFrom); // Set toCoin first
      return bottomCoin; // Then return the new fromCoin
    });
    // alert("hello");
  };

  useEffect(() => {
    handleTopAmountChange();
  }, [fromAmount]);

  const handleTopAmountChange = async () => {
    const amount = parseFloat(fromAmount);

    if (amount == 0 || fromAmount.length == 0) {
      setConvertedAmount("0");
    }

    if (amount > 0) {
      const converted = await convertCurrency(
        String(amount),
        topCoin?.symbol,
        bottomCoin?.symbol,
        rate
      );

      setConvertedAmount(String(parseFloat(String(converted)).toFixed(5)));
    }
  };

  return (
    <>
      <SafeAreaView style={[globalStyles.container]}>
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
              Swap Crypto
            </Text>
          </Pressable>
        </View>

        {loading ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.primary,
            }}
          >
            <Spinner height={40} width={40} />
          </View>
        ) : (
          <KeyboardAwareScrollView
            contentContainerStyle={{
              flexGrow: 1,
              backgroundColor: colors.primary,
              paddingHorizontal: 10,
            }}
            enableOnAndroid
            extraScrollHeight={20}
          >
            <View
              style={[globalStyles.sectionBox, { backgroundColor: "#222222" }]}
            >
              <View
                style={[
                  globalStyles.sectionMain,
                  { justifyContent: "flex-start", gap: 20 },
                ]}
              >
                <Ionicons name="reload" size={ms(20)} color={colors.accent} />
                <View style={{ gap: 10 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 500,
                        fontSize: ms(14),
                        color: colors.secondary,
                      }}
                    >
                      1 {topCoin.symbol?.toUpperCase()}
                    </Text>
                    <Text
                      style={{
                        fontWeight: 500,
                        fontSize: ms(14),
                        color: colors.gray3,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontWeight: 500,
                        fontSize: ms(14),
                        color: colors.secondary,
                      }}
                    >
                      {Number(rate).toFixed(6)}{" "}
                      {bottomCoin?.symbol?.toUpperCase()}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 400,
                        fontSize: ms(12),
                        color: colors.gray3,
                      }}
                    >
                      Refreshening in
                    </Text>
                    <Text
                      style={{
                        fontWeight: 400,
                        fontSize: ms(12),
                        color: "#FFC051",
                      }}
                    >
                      14 Seconds
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{
                position: "relative",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pressable
                onPress={switchCoins}
                style={[
                  globalStyles.sectionBox,
                  {
                    backgroundColor: colors.primary,
                    width: 50,
                    height: 50,
                    position: "absolute",
                    zIndex: 200,
                    alignSelf: "center",
                    borderRadius: 25,
                    alignItems: "center",
                    justifyContent: "center",
                    elevation: 10,
                    padding: 3,
                  },
                ]}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: colors.accent,
                    borderRadius: 25,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="swap-vertical-variant"
                    size={ms(30)}
                    color={colors.primary}
                  />
                </View>
              </Pressable>

              {/* TopCoin */}
              <View
                style={[
                  globalStyles.sectionBox,
                  { backgroundColor: "#222222" },
                ]}
              >
                <View
                  style={[
                    globalStyles.sectionMain,
                    { flexDirection: "column", alignItems: "flex-start" },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: ms(14),
                      fontWeight: 400,
                      color: colors.gray3,
                    }}
                  >
                    You are swapping
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 0,
                      }}
                    >
                      <TextInput
                        style={{
                          fontSize: ms(28),
                          fontWeight: 700,
                          color: colors.white2,
                          // backgroundColor: "red",
                          width: "80%",
                        }}
                        placeholder="0"
                        defaultValue={fromAmount}
                        placeholderTextColor={colors.gray3}
                        onChangeText={(e) => setFromAmount(e)}
                        keyboardType="numeric"
                      />

                      {/* <Text
                      style={{
                        fontSize: ms(28),
                        fontWeight: 700,
                        color: colors.gray3,
                      }}
                    >
                      |
                    </Text> */}
                    </View>
                    <Pressable
                      onPress={() => {
                        setCoinBottomSheet(true);
                        setPosition("top");
                      }}
                      style={[
                        globalStyles.sectionBox,
                        {
                          backgroundColor: colors.gray2,
                          borderRadius: 100,
                          padding: 3,
                          flexDirection: "row",
                          gap: 5,
                          alignItems: "center",
                          elevation: 3,
                          shadowColor: "black",
                          shadowOpacity: 1,
                          shadowRadius: 0.5,
                          shadowOffset: { width: 1, height: 1 },
                        },
                      ]}
                    >
                      <Image
                        source={{ uri: topCoin.image }}
                        style={{ width: ms(25), height: ms(25) }}
                      />
                      <Text
                        style={{
                          fontWeight: 700,
                          fontSize: ms(14),
                          color: colors.secondary,
                        }}
                      >
                        {topCoin.symbol?.toUpperCase()}
                      </Text>
                      <FontAwesome
                        name="chevron-down"
                        color={colors.secondary}
                      />
                    </Pressable>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={[
                        globalStyles.sectionBox,
                        {
                          borderRadius: 100,
                          paddingVertical: 5,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontWeight: 400,
                          fontSize: ms(14),
                          color: colors.gray3,
                        }}
                      >
                        Min: 0.0001276
                      </Text>
                    </View>
                    <View
                      style={[
                        globalStyles.sectionBox,
                        {
                          borderRadius: 100,
                          paddingVertical: 5,
                          backgroundColor: "#222222",
                        },
                      ]}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: 400,
                            fontSize: ms(14),
                            color: colors.gray3,
                          }}
                        >
                          Balance:
                        </Text>
                        <Text
                          style={{
                            fontWeight: 500,
                            fontSize: ms(14),
                            color: colors.secondary,
                          }}
                        >
                          {Number(topWallet?.balance).toFixed(6)}{" "}
                          {topCoin?.symbol?.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              {/* End of TopCoin */}

              {/* BottomCoin */}
              <View
                style={[
                  globalStyles.sectionBox,
                  { backgroundColor: "#222222" },
                ]}
              >
                <View
                  style={[
                    globalStyles.sectionMain,
                    { flexDirection: "column", alignItems: "flex-start" },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: ms(14),
                      fontWeight: 400,
                      color: colors.gray3,
                    }}
                  >
                    You wil receive
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <TextInput
                        style={{
                          fontSize: ms(28),
                          fontWeight: 700,
                          color: colors.white2,
                        }}
                        editable={false}
                        defaultValue={convertedAmount}
                      />
                      <Text
                        style={{
                          fontSize: ms(28),
                          fontWeight: 400,
                          color: colors.gray3,
                        }}
                      >
                        |
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        setCoinBottomSheet(true);
                        setPosition("bottom");
                      }}
                      style={[
                        globalStyles.sectionBox,
                        {
                          backgroundColor: colors.gray2,
                          borderRadius: 100,
                          padding: 3,
                          flexDirection: "row",
                          gap: 5,
                          alignItems: "center",
                          elevation: 3,
                          shadowColor: "black",
                          shadowOpacity: 1,
                          shadowRadius: 0.5,
                          shadowOffset: { width: 1, height: 1 },
                        },
                      ]}
                    >
                      <Image
                        source={{ uri: bottomCoin.image }}
                        style={{ width: ms(25), height: ms(25) }}
                      />
                      <Text
                        style={{
                          fontWeight: 700,
                          fontSize: ms(14),
                          color: colors.secondary,
                        }}
                      >
                        {bottomCoin.symbol?.toUpperCase()}
                      </Text>
                      <FontAwesome
                        name="chevron-down"
                        color={colors.secondary}
                      />
                    </Pressable>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View></View>
                    {/* <View
                    style={[
                      globalStyles.sectionBox,
                      {
                        borderRadius: 100,
                        paddingVertical: 5,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontWeight: 500,
                        fontSize: ms(14),
                        color: colors.white2,
                      }}
                    >
                      $ {toUsdValue}
                    </Text>
                  </View> */}
                    <View
                      style={[
                        globalStyles.sectionBox,
                        {
                          borderRadius: 100,
                          paddingVertical: 5,
                          backgroundColor: "#222222",
                        },
                      ]}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: 400,
                            fontSize: ms(14),
                            color: colors.gray3,
                          }}
                        >
                          Balance:
                        </Text>
                        <Text
                          style={{
                            fontWeight: 500,
                            fontSize: ms(14),
                            color: colors.secondary,
                          }}
                        >
                          {Number(bottomWallet?.balance).toFixed(6)}{" "}
                          {bottomCoin?.symbol?.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              {/* End of BottomCoin */}
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
                  width: "100%",
                  marginTop: 20,
                },
              ]}
            >
              <FontAwesome name="info-circle" color={"#FFC051"} size={ms(14)} />
              <Text
                style={{
                  fontSize: ms(14),
                  color: colors.secondary,
                  fontWeight: 400,
                  lineHeight: 20,
                  width: "95%",
                  // backgroundColor: "red",
                }}
              >
                The exchange rate includes all fees from Evolv2p and our hedging
                counterparty
              </Text>
            </View>

            <View style={[globalStyles.bottomContainer, { paddingBottom: 20 }]}>
              <Pressable
                disabled={Number(fromAmount) <= 0}
                onPress={handleSwap}
                style={[
                  globalStyles.btn,
                  Number(fromAmount) <= 0 && { opacity: 0.5 },
                ]}
              >
                <Text style={globalStyles.btnText}>Swap Now</Text>
              </Pressable>
            </View>
          </KeyboardAwareScrollView>
        )}
      </SafeAreaView>

      <BottomSheet
        setVisible={setCoinBottomSheet}
        visible={coinBottomSheet}
        height={ms(50)}
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
              setCoinBottomSheet(false);
              setConvertedAmount("0");
              setFromAmount("0");

              if (position == "top") {
                setTopCoin(coin);
              } else if (position == "bottom") {
                setBottomCoin(coin);
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

      <BottomSheet
        setVisible={setSwapBottomSheet}
        visible={swapBottomSheet}
        height={100}
      >
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <Text
            style={{
              textAlign: "center",
              fontWeight: 500,
              fontSize: ms(16),
              color: colors.secondary,
            }}
          >
            Review Transaction
          </Text>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              flexDirection: "row",
              marginVertical: 20,
            }}
          >
            <Image
              source={{ uri: topCoin.image }}
              style={{ width: 60, height: 60 }}
              priority={"high"}
            />
            <Image
              source={{ uri: bottomCoin.image }}
              style={{ width: 60, height: 60, marginLeft: -20 }}
              priority={"high"}
            />
          </View>

          <Text
            style={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: ms(20),
              color: colors.white2,
            }}
          >
            Confirm swap of {topCoin.symbol?.toUpperCase()} to{" "}
            {bottomCoin.symbol?.toUpperCase()}
          </Text>
          {boxWrapper(
            "You Pay",
            `${fromAmount} ${topCoin?.symbol?.toUpperCase()}`
          )}
          {boxWrapper(
            "You Get",
            `${convertedAmount} ${bottomCoin.symbol?.toUpperCase()}`
          )}
          {boxWrapper(
            "Exchange Rate",
            `1 ${topCoin.symbol.toUpperCase()} = ${rate.toFixed(
              5
            )} ${bottomCoin?.symbol?.toUpperCase()}`
          )}

          {boxWrapper(
            "Network Fee",
            `0.0001 ${topCoin?.symbol?.toUpperCase()}`
          )}
          {boxWrapper("Total Cost", `${Number(fromAmount) + 0.0001}`)}
          {boxWrapper("Estimated Time", "< 2 minutes")}

          <Text
            style={{
              textAlign: "center",
              fontWeight: 500,
              fontSize: ms(16),
              color: colors.white,
              marginVertical: 20,
            }}
          >
            Review the above before confirming Once made, your transaction is
            irreversible
          </Text>

          <View style={[globalStyles.bottomContainer, { paddingBottom: 20 }]}>
            <Pressable
              disabled={swapLoading}
              onPress={handleConfirmSwap}
              style={[globalStyles.btn, swapLoading && { opacity: 0.5 }]}
            >
              {swapLoading ? (
                <Spinner height={20} width={20} />
              ) : (
                <Text style={globalStyles.btnText}>Confirm Swap</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </BottomSheet>
    </>
  );
};

export default Swap;

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
