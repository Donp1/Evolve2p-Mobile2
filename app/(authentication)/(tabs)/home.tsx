import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from "react-native";
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
import { useCoins, useCoinStore } from "@/context";
import {
  convertCryptoToCurrency,
  fetchPrices,
  formatNumber,
  getCoinPrice,
  getTotalBalanceInCurrency,
  getUsdValue,
  getUser,
  priceFormater,
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
import { router, usePathname, useRouter } from "expo-router";
import { set } from "lodash";
import { useUserStore } from "@/store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";
import TotalBalance from "@/components/Balance";
import BalanceViewer from "@/components/BalanceViewer";
import Assets from "@/components/Assets";
import { io } from "socket.io-client";
import NewTrade from "@/components/NewTrade";
import NotificationView from "@/components/NotificationView";

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const socket = io("https://evolve2p-backend.onrender.com");

export interface homeContent {
  icon: React.ReactNode;
  heading: string;
  description: string;
}

const Home = () => {
  const [coinLoading, setCoinLoading] = React.useState(false);
  const [selectedCurrency, setSelectedCurrency] =
    useState<SelectedCurrency | null>();
  const [lockCurrency, setLockCurrency] = useState(false);

  const [preferedCoinVisible, setPreferedCoinVisible] = useState(false);
  const [completeKycVisible, setCompleteKycVisible] = useState(false);
  const [myBalances, setMyBalances] = useState<
    { crypto: string; amount: number }[]
  >([]);

  const setCoin = useCoins((state) => state.setCoin);
  const { coins, fetchCoins, loading, error } = useCoinStore();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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
    if (coins.length === 0) {
      fetchCoins(); // only fetch once (caching logic)
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    // do your refresh logic here (e.g. API call)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.replace(pathname as any); // reloads the same page

    setRefreshing(false);
  };

  return (
    <SafeAreaView style={[globalStyles.container]}>
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

        {/* <View style={styles.notiContainer}>
          <Ionicons
            style={styles.noti}
            name="notifications"
            size={20}
            color={colors.secondary}
          />
        </View> */}
        <NotificationView />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: colors.primary,
        }}
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
            selectedCurrency={selectedCurrency}
            setLockCurrency={setLockCurrency}
            setPreferedCoinVisible={setPreferedCoinVisible}
            preferedCoinVisible={preferedCoinVisible}
            setSelectedCurrency={setSelectedCurrency}
            refreshing={refreshing}
          />

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

          <Assets lockCurrency={lockCurrency} />

          <StoryBox />

          <NewTrade />

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
    </SafeAreaView>
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
