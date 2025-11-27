import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ActionableOffer } from "@/components/OfferCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/utils/globalStyles";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import CryptoPriceWithMargin from "@/components/CryptoPriceWithMargin ";
import { useCoinStore } from "@/context";
import { Image } from "expo-image";
import {
  convertCurrencyToCrypto,
  createTrade,
  priceFormater,
} from "@/utils/countryStore";
import Spinner from "@/components/Spinner";
import CryptoConverter from "@/components/CurrencyPriceAmount";
import { debounce, isArray } from "lodash";
import { useAlert } from "@/components/AlertService";
import ChatView from "@/components/ChatView";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const goBack = () => {
  if (router.canGoBack()) router.back();
};

interface User {
  id: string;
  username: string;
  email: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  createdAt: string;
}

interface offerType {
  id: string;
  userId: string;
  type: "BUY" | "SELL";
  crypto: string;
  currency: string;
  margin: number;
  paymentMethodId: string;
  minLimit: number;
  maxLimit: number;
  terms: string;
  time: string;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  user: User;
  paymentMethod: PaymentMethod;
}

interface Country {
  cca2: string;
  flags: { png: string };
  currencies?: {
    [code: string]: { name: string; symbol: string };
  };
}

interface SelectedCurrency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

const fetchCurrencyDetails = async (
  currencyCode: string
): Promise<SelectedCurrency | null> => {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,currencies,cca2"
    );
    const data: Country[] = await res.json();
    const withCurrency = data.filter((c) => c.currencies);

    const code = currencyCode.toUpperCase();

    // special case: USD → always pick United States
    if (code === "USD") {
      const usa = withCurrency.find(
        (c) => c.cca2 === "US" && c.currencies?.USD
      );
      if (usa?.currencies?.USD) {
        return {
          code: "USD",
          name: usa.currencies.USD.name,
          symbol: usa.currencies.USD.symbol,
          flag: usa.flags.png,
        };
      }
    }

    // otherwise: find first country with that currency
    const country = withCurrency.find((c) => c.currencies?.[code]);

    if (country?.currencies?.[code]) {
      return {
        code,
        name: country.currencies[code].name,
        symbol: country.currencies[code].symbol,
        flag: country.flags.png,
      };
    }

    return null;
  } catch (e) {
    console.error("Error fetching currency details:", e);
    return null;
  }
};

const Trade = () => {
  const { id: offerId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [loadingCurrency, setLoadingCurrency] = useState(false);
  const [loadingConversion, setLoadingConversion] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<offerType>();
  const [actionLabel, setActionLabel] = useState("");
  const [currencyDetails, setCurrencyDetails] = useState<SelectedCurrency>();
  const [cryptoValue, setCryptoValue] = useState<number>(0);
  const [conversionAmount, setConversionAmount] = useState<number>(0.0);
  const [isCreating, setIsCreating] = useState(false);
  const [refresh, setRefresh] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  const coins = useCoinStore((state) => state.coins);
  const currentCoin = coins.find(
    (coin) => coin.symbol?.toUpperCase() == currentOffer?.crypto?.toUpperCase()
  );
  const { AlertComponent, showAlert } = useAlert();

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://evolve2p-backend.onrender.com/api/get-offer/${offerId}`
        );
        if (!res.ok) throw new Error("Failed to fetch offer");
        const data: offerType = await res.json();
        setCurrentOffer(data);
        const lable = data?.type?.toLowerCase() === "sell" ? "Buy" : "Sell";
        setActionLabel(lable);
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (offerId) fetchOffer();
  }, [offerId]);

  useEffect(() => {
    (async () => {
      if (!currentOffer) return;
      setLoadingCurrency(true);
      const details = await fetchCurrencyDetails(
        currentOffer?.currency.toUpperCase() || "USD"
      );
      setLoadingCurrency(false);
      if (details) setCurrencyDetails(details);
    })();
  }, [currentOffer]);

  const handleConversion = useCallback(
    debounce(async (value: string) => {
      if (!value || isNaN(Number(value))) {
        setCryptoValue(0);
        return;
      }

      setLoadingConversion(true);
      try {
        const result = await convertCurrencyToCrypto(
          currentOffer?.crypto?.toUpperCase() || "BTC",
          Number(value),
          currentOffer?.currency.toUpperCase() || "USD"
        );

        setCryptoValue(result);
      } catch (err) {
        console.error("Conversion failed:", err);
        setCryptoValue(0);
      } finally {
        setLoadingConversion(false);
      }
    }, 500), // 500ms debounce
    [currentOffer]
  );

  const hanndleCreateTrade = async () => {
    setIsCreating(true);

    if (!offerId || cryptoValue <= 0 || conversionAmount <= 0) return;

    const createTradeRes = await createTrade(
      isArray(offerId) ? offerId[0] : offerId,
      conversionAmount,
      cryptoValue
    );

    setIsCreating(false);

    if (createTradeRes?.error) {
      showAlert(
        "Error",
        createTradeRes?.message,
        [{ onPress() {}, text: "Close" }],
        "error"
      );
      setIsCreating(false);
      return;
    }

    if (createTradeRes?.success) {
      showAlert(
        "Success",
        createTradeRes?.message,
        [
          {
            text: "Continue",
            onPress() {
              router.push({
                pathname: "/process-trade/[id]",
                params: {
                  id: createTradeRes?.trade?.id,
                },
              });
            },
          },
        ],
        "success"
      );
    }
  };

  const onRefresh = () => {
    setRefresh((p) => p + 1);
    setRefreshing(false);
  };

  // ✅ Call conversion whenever fiatAmount changes
  useEffect(() => {
    handleConversion(conversionAmount.toString());
  }, [conversionAmount]);
  return (
    <>
      <SafeAreaView style={globalStyles.container}>
        {AlertComponent}
        {loading ? (
          <View
            style={{
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Spinner width={40} height={40} />
          </View>
        ) : (
          <>
            {/* topbar */}
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
                  {actionLabel} {currentOffer?.crypto}
                </Text>
              </Pressable>
            </View>
            {/* end of topbar */}

            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              enableOnAndroid
              extraScrollHeight={5}
              contentContainerStyle={{
                paddingBottom: 100,
                backgroundColor: colors.primary,
                flexGrow: 1,
                paddingHorizontal: 10,
              }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <View
                style={[
                  globalStyles.sectionBox,
                  { backgroundColor: "#222222" },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="reload" size={ms(15)} color="#FFC051" />
                  <View style={{ gap: 5 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: ms(14),
                          fontWeight: 500,
                          color: colors.secondary,
                        }}
                      >
                        1 {currentOffer?.crypto}
                      </Text>
                      <Text
                        style={{
                          fontSize: ms(12),
                          fontWeight: 500,
                          color: colors.secondary,
                        }}
                      >
                        =
                      </Text>

                      <CryptoPriceWithMargin
                        coin={currentOffer?.crypto || "BTC"}
                        margin={currentOffer?.margin}
                        displayStyle={{
                          color: colors.secondary,
                          fontWeight: 500,
                          fontSize: ms(14),
                        }}
                        refresh={refresh}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: ms(12),
                          fontWeight: 400,
                          color: colors.gray4,
                        }}
                      >
                        Processing fee
                      </Text>
                      <Text
                        style={{
                          fontSize: ms(12),
                          fontWeight: 500,
                          color: colors.secondary,
                        }}
                      >
                        =
                      </Text>
                      <Text
                        style={{
                          fontSize: ms(14),
                          fontWeight: 500,
                          color: colors.secondary,
                        }}
                      >
                        0.0005 {currentOffer?.crypto}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={[
                  globalStyles.sectionBox,
                  { gap: 10, backgroundColor: "#222222" },
                ]}
              >
                <Text
                  style={{
                    fontSize: ms(14),
                    fontWeight: 400,
                    color: colors.gray4,
                  }}
                >
                  You Pay
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <TextInput
                    keyboardType="numeric"
                    // defaultValue={conversionAmount.toString()}
                    placeholder="0"
                    placeholderTextColor={colors.gray4}
                    onChangeText={(e) => setConversionAmount(Number(e))}
                    style={{
                      fontSize: ms(24),
                      fontWeight: 700,
                      color: colors.gray4,
                      paddingEnd: 10,
                      flex: 1,
                    }}
                    autoFocus
                  />

                  {loadingCurrency ? (
                    <Spinner width={20} height={20} />
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        borderRadius: 100,
                        backgroundColor: colors.gray2,
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 4,
                        gap: 10,
                      }}
                    >
                      <Image
                        source={{ uri: currencyDetails?.flag }}
                        style={{
                          width: ms(24),
                          height: ms(24),
                          borderRadius: 24 / 2,
                        }}
                      />
                      <Text
                        style={{
                          color: colors.secondary,
                          fontWeight: 700,
                          fontSize: ms(14),
                        }}
                      >
                        {currencyDetails?.code?.toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <View style={{ gap: 5 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: ms(12),
                          fontWeight: 400,
                          color: colors.gray4,
                        }}
                      >
                        1 {currentOffer?.currency}
                      </Text>
                      <Text
                        style={{
                          fontSize: ms(12),
                          fontWeight: 500,
                          color: colors.secondary,
                        }}
                      >
                        =
                      </Text>

                      <CryptoConverter
                        amount={1}
                        coin={currentOffer?.crypto || "BTC"}
                        currency={currentOffer?.currency || "USD"}
                        style={{
                          fontSize: ms(12),
                          fontWeight: 500,
                          color: colors.secondary,
                        }}
                        refresh={refresh}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={[
                  globalStyles.sectionBox,
                  { gap: 10, backgroundColor: "#222222" },
                ]}
              >
                <Text
                  style={{
                    fontSize: ms(14),
                    fontWeight: 400,
                    color: colors.gray4,
                  }}
                >
                  You Receive
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: ms(24),
                      fontWeight: 700,
                      color: colors.gray4,
                      borderRightWidth: 2,
                      borderRightColor: colors.secondary,
                      paddingEnd: 10,
                      maxWidth: "80%",
                      // flex: 1,
                    }}
                  >
                    {cryptoValue}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      borderRadius: 100,
                      backgroundColor: colors.gray2,
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 4,
                      gap: 10,
                    }}
                  >
                    <Image
                      source={{ uri: currentCoin?.image }}
                      style={{ width: ms(24), height: ms(24) }}
                    />
                    <Text
                      style={{
                        color: colors.secondary,
                        fontWeight: 700,
                        fontSize: ms(14),
                      }}
                    >
                      {currentCoin?.symbol?.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ gap: 3, marginVertical: 10 }}>
                <View style={styles.top}>
                  <Text
                    style={{
                      fontWeight: 400,
                      fontSize: ms(14),
                      color: colors.secondary,
                    }}
                  >
                    Limit
                  </Text>
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: ms(14),
                      color: colors.white2,
                    }}
                  >
                    {currencyDetails?.symbol}
                    {priceFormater(currentOffer?.minLimit || 0, {
                      style: "short",
                    })}{" "}
                    - {currencyDetails?.symbol}
                    {priceFormater(currentOffer?.maxLimit || 0, {
                      style: "short",
                    })}
                  </Text>
                </View>
                <View
                  style={[
                    styles.middle,
                    { borderLeftColor: "#FFFA66", borderLeftWidth: 1 },
                  ]}
                >
                  <Text
                    style={{
                      fontWeight: 400,
                      fontSize: ms(14),
                      color: colors.secondary,
                    }}
                  >
                    Payment Method
                  </Text>
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: ms(14),
                      color: colors.white2,
                    }}
                  >
                    {currentOffer?.paymentMethod.name}
                  </Text>
                </View>
                <View style={styles.bottom}>
                  <Text
                    style={{
                      fontWeight: 400,
                      fontSize: ms(14),
                      color: colors.secondary,
                    }}
                  >
                    Time limit
                  </Text>
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: ms(14),
                      color: colors.white2,
                    }}
                  >
                    {currentOffer?.time}
                  </Text>
                </View>
              </View>

              <View style={globalStyles.sectionBox}>
                <Text
                  style={{
                    fontSize: ms(14),
                    fontWeight: 700,
                    color: colors.white2,
                    marginBottom: 20,
                  }}
                >
                  Offer Terms (please read carefully)
                </Text>
                {currentOffer?.terms || currentOffer?.terms !== "" ? (
                  <View style={{}}>
                    <Text
                      style={{
                        fontSize: ms(14),
                        fontWeight: 700,
                        color: colors.white,
                        marginBottom: 20,
                      }}
                    >
                      {currentOffer?.terms}
                    </Text>
                  </View>
                ) : (
                  <View style={{}}>
                    <Text
                      style={{
                        fontSize: ms(14),
                        fontWeight: 700,
                        color: colors.gray4,
                        marginBottom: 20,
                      }}
                    >
                      No specific terms provided. Please follow standard
                      platform rules.
                    </Text>
                  </View>
                )}
              </View>

              {/* read guide */}
              {/* <Pressable
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons
                  name="menu-book"
                  size={ms(16)}
                  color={colors.accent}
                />
                <Text
                  style={{
                    fontSize: ms(14),
                    fontWeight: 700,
                    color: colors.accent,
                  }}
                >
                  Read our guide for creating crypto
                </Text>
              </Pressable> */}
              {/* end of read guide */}

              {/* submit button */}

              <Pressable
                onPress={hanndleCreateTrade}
                disabled={
                  !conversionAmount ||
                  conversionAmount <= 0 ||
                  !cryptoValue ||
                  cryptoValue <= 0 ||
                  isCreating
                }
                style={[
                  globalStyles.btn,
                  {
                    marginTop: 20,
                    marginBottom: 20,
                    width: "100%",
                    opacity:
                      !conversionAmount ||
                      conversionAmount <= 0 ||
                      !cryptoValue ||
                      cryptoValue <= 0 ||
                      isCreating
                        ? 0.5
                        : 1,
                  },
                ]}
              >
                {isCreating ? (
                  <Spinner width={20} height={20} />
                ) : (
                  <Text style={globalStyles.btnText}>
                    {actionLabel} {currentOffer?.crypto}{" "}
                  </Text>
                )}
              </Pressable>
              {/* end of submit button */}
            </KeyboardAwareScrollView>
          </>
        )}
      </SafeAreaView>
    </>
  );
};

export default Trade;

const styles = StyleSheet.create({
  notiContainer: {
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.gray2,
  },

  top: {
    backgroundColor: colors.gray2,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  middle: {
    backgroundColor: colors.gray2,
    // borderTopRightRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottom: {
    backgroundColor: colors.gray2,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
