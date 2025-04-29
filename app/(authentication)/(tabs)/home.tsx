import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { globalStyles } from "@/utils/globalStyles";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { colors } from "@/constants";
import { ms, s } from "react-native-size-matters";
import {
  AntDesign,
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useCoins } from "@/context";
import { getCoinPrice, getUsdValue } from "@/utils/countryStore";
import { Image } from "expo-image";
import Spinner from "@/components/Spinner";
import { getItemAsync } from "expo-secure-store";
import PreferedCurrency from "@/components/PreferedCurrency";
import StoryBox from "@/components/Storybox";
import GridComponent from "@/components/GridComponent";
import BottomSheet from "@/components/BottomSheet";
import { router } from "expo-router";
import { set } from "lodash";

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export interface homeContent {
  icon: React.ReactNode;
  heading: string;
  description: string;
}

const Home = () => {
  const [coinLoading, setCoinLoading] = React.useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [lockCurrency, setLockCurrency] = useState(false);

  const [preferedCoinVisible, setPreferedCoinVisible] = useState(false);
  const [completeKycVisible, setCompleteKycVisible] = useState(false);
  const [user, setUser] = useState<any>({});

  const coins = useCoins((state) => state.coins);
  const setCoin = useCoins((state) => state.setCoin);

  const [contentOne, setContentOne] = useState<homeContent[]>([
    {
      heading: "Bank Transfers",
      description: "Receive funds in your bank account.",
      icon: (
        <MaterialCommunityIcons
          name="bank-outline"
          size={ms(26)}
          color="#fff"
        />
      ),
    },
    {
      heading: "Online Wallets",
      description: "PayPal, Skrill, Neteller",
      icon: <AntDesign name="wallet" size={ms(26)} color="#fff" />,
    },
    {
      heading: "Get cash in your city",
      description: "Worldwide",
      icon: <FontAwesome6 name="money-bills" size={ms(26)} color="#fff" />,
    },
  ]);

  const [contentTwo, setContentTwo] = useState<homeContent[]>([
    {
      heading: "Bank Transfers",
      description: "Buy directly from your bank",
      icon: (
        <MaterialCommunityIcons
          name="bank-outline"
          size={ms(26)}
          color="#fff"
        />
      ),
    },
    {
      heading: "Online Wallets",
      description: "Buy with Visa or MasterCard",
      icon: <AntDesign name="wallet" size={ms(26)} color="#fff" />,
    },
    {
      heading: "Get cash in your city",
      description: "Pay using mobile payment services",
      icon: <FontAwesome6 name="money-bills" size={ms(26)} color="#fff" />,
    },
  ]);

  useEffect(() => {
    (async () => {
      setCoinLoading(true);
      const btcPrice = await getCoinPrice("bitcoin");
      const ethPrice = await getCoinPrice("ethereum");
      const usdtPrice = await getCoinPrice("tether");
      const usdcPrice = await getCoinPrice("usd-coin");

      setCoin([
        {
          symbol: "btc",
          image: "https://assets.coincap.io/assets/icons/btc@2x.png",
          price: btcPrice.price,
          name: "Bitcoin",
        },

        {
          symbol: "eth",
          image: "https://assets.coincap.io/assets/icons/eth@2x.png",
          price: ethPrice.price,
          name: "Ethereum",
        },
        {
          symbol: "usdt",
          image: "https://assets.coincap.io/assets/icons/usdt@2x.png",
          price: usdtPrice.price,
          name: "USDT",
        },
        {
          symbol: "usdc",
          image: "https://assets.coincap.io/assets/icons/usdc@2x.png",
          price: usdcPrice.price,
          name: "USDC",
        },
      ]);
      setCoinLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await getItemAsync("authToken");
      if (res) {
        const parsedUser = JSON.parse(res);
        setUser(parsedUser?.user);
      }
    })();
  }, []);

  return (
    <View style={[globalStyles.container]}>
      <View style={[globalStyles.topBar, { padding: 10 }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text
            style={{ fontSize: ms(14), fontWeight: 400, color: colors.gray3 }}
          >
            Hello,
          </Text>
          <Text
            style={{
              fontWeight: 400,
              fontSize: ms(14),
              color: colors.white2,
            }}
          >
            @{user?.username}
          </Text>
        </View>

        <View style={styles.notiContainer}>
          <Ionicons
            style={styles.noti}
            name="notifications"
            size={20}
            color={colors.secondary}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
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

          <View style={styles.balance}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: ms(16),
                  color: colors.gray3,
                }}
              >
                Available Balance
              </Text>
              <Pressable style={{}} onPress={() => setLockCurrency((c) => !c)}>
                {lockCurrency ? (
                  <Feather
                    name="eye-off"
                    size={ms(16)}
                    color={colors.secondary}
                    style={{ marginLeft: 10 }}
                  />
                ) : (
                  <Feather
                    name="eye"
                    size={ms(16)}
                    color={colors.secondary}
                    style={{ marginLeft: 10 }}
                  />
                )}
              </Pressable>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  alignItems: "center",
                  flex: 1,
                }}
              >
                {lockCurrency ? (
                  <Text
                    style={{
                      fontWeight: 700,
                      fontSize: ms(26),
                      color: colors.white2,
                    }}
                  >
                    ****
                  </Text>
                ) : (
                  <>
                    <Text
                      style={{
                        fontWeight: 700,
                        fontSize: ms(20),
                        color: colors.white2,
                      }}
                    >
                      $
                    </Text>
                    <Text
                      style={{
                        fontWeight: 700,
                        fontSize: ms(26),
                        color: colors.white2,
                      }}
                    >
                      0
                    </Text>
                  </>
                )}
              </View>
              <Pressable
                onPress={() => setPreferedCoinVisible((c) => !c)}
                style={{
                  backgroundColor: colors.gray2,
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 100,
                  gap: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: 700,
                    fontSize: ms(14),
                    color: colors.secondary,
                  }}
                >
                  {selectedCurrency}
                </Text>
                <FontAwesome
                  name="chevron-down"
                  size={ms(12)}
                  color={colors.secondary}
                />
              </Pressable>
            </View>
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
            <FontAwesome
              name="long-arrow-right"
              size={ms(16)}
              color={colors.secondary}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            {coinLoading ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <Spinner width={40} height={40} />
              </View>
            ) : (
              <>
                {coins.map((coin, index) => (
                  <View key={index} style={styles.coinContainer}>
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
                        style={{ width: ms(40), height: ms(40) }}
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
                        <Text
                          style={{
                            color: colors.secondary,
                            fontWeight: 500,
                            fontSize: ms(10),
                          }}
                        >
                          {USDollar.format(parseFloat(coin.price))}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: colors.white2,
                          fontSize: ms(14),
                          fontWeight: 700,
                        }}
                      >
                        {lockCurrency ? "****" : "0.00"}
                      </Text>
                      <Text
                        style={{
                          color: colors.secondary,
                          fontWeight: 500,
                          fontSize: ms(12),
                        }}
                      >
                        {lockCurrency ? "****" : " $ 0.00"}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>

          <StoryBox />

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
              Convert your crypto into cash
            </Text>
            <FontAwesome
              name="long-arrow-right"
              size={ms(16)}
              color={colors.secondary}
            />
          </View>

          <GridComponent data={contentOne} />

          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 10,
              }}
            >
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: ms(16),
                  color: colors.white,
                }}
              >
                Purchase crypto easily
              </Text>
              <FontAwesome
                name="long-arrow-right"
                size={ms(16)}
                color={colors.secondary}
              />
            </View>
            <GridComponent data={contentTwo} />
          </View>
        </View>
      </ScrollView>

      <PreferedCurrency
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        setVisible={setPreferedCoinVisible}
        visible={preferedCoinVisible}
      />

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
    </View>
  );
};

export default Home;

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
