import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from "react-native";
import {
  AntDesign,
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { SafeAreaView } from "react-native-safe-area-context";
import { ms } from "react-native-size-matters";
import { io } from "socket.io-client";

import { globalStyles } from "@/utils/globalStyles";
import { colors } from "@/constants";
import { useCoins, useCoinStore } from "@/context";
import { useUserStore } from "@/store/userStore";
import { usePathname, useRouter } from "expo-router";

import NotificationView from "@/components/NotificationView";
import BalanceViewer from "@/components/BalanceViewer";
import Assets from "@/components/Assets";
import StoryBox from "@/components/Storybox";
import GridComponent from "@/components/GridComponent";
import BottomSheet from "@/components/BottomSheet";
import { Image } from "expo-image";
import NewTrade from "@/components/NewTrade";
import { SelectedCurrency } from "@/components/PreferedCurrency";

const socketUrl = "https://evolve2p-backend.onrender.com";

export interface homeContent {
  icon: React.ReactNode;
  heading: string;
  description: string;
}

const Home = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<
    SelectedCurrency | null | undefined
  >(null);
  const [lockCurrency, setLockCurrency] = useState(false);
  const [preferedCoinVisible, setPreferedCoinVisible] = useState(false);
  const [completeKycVisible, setCompleteKycVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const setCoin = useCoins((state) => state.setCoin);
  const { coins, fetchCoins } = useCoinStore();
  const user = useUserStore((state) => state.user);

  const router = useRouter();
  const pathname = usePathname();

  // ✅ Only define static content once
  const contentOne = useMemo<homeContent[]>(
    () => [
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
    ],
    []
  );

  const contentTwo = useMemo<homeContent[]>(
    () => [
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
    ],
    []
  );

  // ✅ fetch coins only once
  useEffect(() => {
    if (coins.length === 0) fetchCoins();
  }, [coins.length, fetchCoins]);

  // ✅ socket connection
  useEffect(() => {
    const socket = io(socketUrl, { transports: ["websocket"] });
    socket.on("connect", () => console.log("Socket connected"));
    socket.on("disconnect", () => console.log("Socket disconnected"));
    return () => {
      socket.disconnect();
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCoins(); // just refetch data instead of full reload
    setRefreshing(false);
  }, [fetchCoins]);

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Header */}
      <View style={[globalStyles.topBar, { padding: 10 }]}>
        <View style={styles.row}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.username}>@{user?.username}</Text>
        </View>
        <NotificationView />
      </View>

      {/* Scroll Content */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          {/* KYC prompt */}
          {!user?.kycVerified && (
            <Pressable
              onPress={() => setCompleteKycVisible(true)}
              style={styles.kycBox}
            >
              <View style={styles.kycRow}>
                <MaterialIcons name="error" size={ms(16)} color="#F5918A" />
                <Text style={styles.kycText}>
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

          {/* Balance */}
          <BalanceViewer
            lockCurrency={lockCurrency}
            selectedCurrency={selectedCurrency}
            setLockCurrency={setLockCurrency}
            setPreferedCoinVisible={setPreferedCoinVisible}
            preferedCoinVisible={preferedCoinVisible}
            setSelectedCurrency={setSelectedCurrency}
            refreshing={refreshing}
          />

          {/* Assets */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Assets</Text>
            <FontAwesome
              name="long-arrow-right"
              size={ms(16)}
              color={colors.secondary}
            />
          </View>

          <Assets lockCurrency={lockCurrency} />

          {/* Stories + Trade */}
          <StoryBox />
          <NewTrade />

          {/* Convert */}
          {/* <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Convert your crypto into cash
            </Text>
            <FontAwesome
              name="long-arrow-right"
              size={ms(16)}
              color={colors.secondary}
            />
          </View> */}
          {/* <GridComponent data={contentOne} /> */}

          {/* Purchase */}
          {/* <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Purchase crypto easily</Text>
              <FontAwesome
                name="long-arrow-right"
                size={ms(16)}
                color={colors.secondary}
              />
            </View>
            <GridComponent data={contentTwo} />
          </View> */}
        </View>
      </ScrollView>

      {/* KYC Modal */}
      <BottomSheet
        visible={completeKycVisible}
        setVisible={setCompleteKycVisible}
      >
        <View style={styles.kycModal}>
          <Image
            source={require("@/assets/images/user-x.png")}
            style={{ width: ms(54), height: ms(57) }}
            contentFit="contain"
          />
          <Text style={styles.kycModalTitle}>
            Complete Your KYC to Continue
          </Text>
          <Text style={styles.kycModalText}>
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
            <Text style={[globalStyles.btnText, styles.btnText]}>
              Verify Now
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setCompleteKycVisible(false)}
            style={[globalStyles.btn, styles.laterBtn]}
          >
            <Text style={[globalStyles.btnText, styles.btnLaterText]}>
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
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  greeting: { fontSize: ms(14), fontWeight: "400", color: colors.gray3 },
  username: { fontSize: ms(14), fontWeight: "400", color: colors.white2 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
    backgroundColor: colors.primary,
  },
  kycBox: {
    width: "100%",
    backgroundColor: colors.gray2,
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderLeftWidth: 2,
    borderLeftColor: "#F5918A",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  kycRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  kycText: {
    flex: 1,
    color: colors.secondary,
    fontSize: ms(12),
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  sectionTitle: { fontSize: ms(16), fontWeight: "500", color: colors.white },
  kycModal: { flex: 1, alignItems: "center" },
  kycModalTitle: {
    fontWeight: "700",
    fontSize: ms(20),
    lineHeight: 28,
    color: colors.white2,
    marginTop: 20,
  },
  kycModalText: {
    fontWeight: "400",
    fontSize: ms(14),
    lineHeight: 20,
    color: colors.gray3,
    textAlign: "center",
    marginTop: 10,
  },
  btnText: { fontSize: ms(14), fontWeight: "700" },
  laterBtn: { marginTop: 20, backgroundColor: colors.gray2 },
  btnLaterText: { fontSize: ms(14), fontWeight: "700", color: colors.white2 },
});
