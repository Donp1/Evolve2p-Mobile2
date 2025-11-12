import React, { useState, useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ms, s } from "react-native-size-matters";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";

import { globalStyles } from "@/utils/globalStyles";
import { colors } from "@/constants";
import { truncateText } from "@/utils/countryStore";
import { useCoinStore } from "@/context";
import { useOffers } from "@/hooks/useOffers";

import NotificationView from "@/components/NotificationView";
import OfferCard from "@/components/OfferCard";
import CoinBottomSheet from "@/components/CoinBottomSheet";
import PaymentMethodSelector, {
  PaymentMethod,
} from "@/components/SelectPaymentMethod";
import PreferedCurrency, {
  SelectedCurrency,
} from "@/components/PreferedCurrency";
import { useUserStore } from "@/store/userStore";
import { useAlert } from "@/components/AlertService";

const Market = () => {
  const coins = useCoinStore((state) => state.coins);

  const [section, setSection] = useState<"buy" | "sell">("buy");
  const [topFilterCoin, setTopFilterCoin] = useState(false);
  const [activeTopCoin, setActiveTopCoin] = useState(coins[0] ?? null);

  const [preferedCoinVisible, setPreferedCoinVisible] = useState(false);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCurrency, setSelectedCurrency] =
    useState<SelectedCurrency | null>(null);
  const [filterPayments, setFilterPayments] = useState<PaymentMethod[]>([]);

  const { offers, loading: offerLoading } = useOffers({
    type: section,
    crypto: activeTopCoin?.symbol,
    paymentMethod: filterPayments.map((pm) => pm.id),
    currency: selectedCurrency?.code || "USD",
  });

  const user = useUserStore((state: any) => state.user);

  const { AlertComponent, showAlert } = useAlert();

  const handleTrade = useCallback((id: string) => {
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
    router.push({ pathname: "/trade/[id]", params: { id } });
  }, []);

  // ✅ useMemo avoids recalculating
  const offerList = useMemo(() => offers?.data ?? [], [offers]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // simulate fetching data from API
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Top Bar */}
      <View style={[globalStyles.topBar, styles.topBar]}>
        <Text style={styles.topBarTitle}>P2P Marketplace</Text>
        <View style={styles.topBarActions}>
          <View style={styles.notiContainer}>
            <FontAwesome5
              name="headset"
              size={ms(17)}
              color={colors.secondary}
            />
          </View>
          <NotificationView />
        </View>
      </View>

      {/* Content */}
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2196F3"]} // Android
            tintColor="#2196F3" // iOS
            title="Refreshing..."
          />
        }
        style={{ padding: 10, backgroundColor: colors.primary }}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            {/* Buy/Sell toggle */}
            <View style={styles.sectionRow}>
              <View style={styles.btnContainer}>
                {(["buy", "sell"] as const).map((type) => (
                  <Pressable
                    key={type}
                    onPress={() => setSection(type)}
                    style={[
                      styles.btn,
                      section === type && { backgroundColor: colors.gray },
                    ]}
                  >
                    <Text
                      style={[
                        styles.btnText,
                        section === type && {
                          fontWeight: "500",
                          color: colors.white2,
                        },
                      ]}
                    >
                      {type === "buy" ? "Buy" : "Sell"}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable style={[styles.notiContainer, styles.rowCenter]}>
                <Ionicons
                  name="reload"
                  size={ms(17)}
                  color={colors.secondary}
                />
              </Pressable>
            </View>

            {/* Filters */}
            <View style={styles.filtersRow}>
              <Pressable
                onPress={() => setTopFilterCoin(true)}
                style={[styles.topBox, { flex: 2 }]}
              >
                <View style={styles.rowBetween}>
                  <Image
                    source={{ uri: activeTopCoin?.image ?? "" }}
                    style={styles.coinIcon}
                  />
                  <Text style={styles.filterText}>
                    {activeTopCoin?.symbol?.toUpperCase() ?? "Coin"}
                  </Text>
                  <Entypo
                    name="chevron-small-down"
                    size={24}
                    color={colors.white}
                  />
                </View>
              </Pressable>

              <Pressable
                onPress={() => setPaymentMethodFilter(true)}
                style={[styles.topBox, { flex: 2 }]}
              >
                <View style={styles.rowBetween}>
                  <Text style={styles.filterText}>
                    {truncateText("Payment method", 10)}
                  </Text>
                  <Entypo
                    name="chevron-small-down"
                    size={24}
                    color={colors.white}
                  />
                </View>
              </Pressable>

              <Pressable style={styles.notiContainer}>
                <AntDesign
                  name="filter"
                  size={ms(17)}
                  color={colors.secondary}
                />
              </Pressable>
            </View>

            {/* Amount Input */}
            {/* <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}`
                placeholder={`Enter ${selectedCurrency?.code ?? "USD"} Amount`}
                placeholderTextColor={colors.secondary}
                keyboardType="numeric"
                inputMode="numeric"
              />
              <Pressable
                onPress={() => setPreferedCoinVisible((c) => !c)}
                style={styles.currencySelector}
              >
                {selectedCurrency?.flag && (
                  <Image
                    source={{ uri: selectedCurrency.flag }}
                    style={styles.flagIcon}
                  />
                )}
                <Text style={styles.currencyCode}>
                  {selectedCurrency?.code?.toUpperCase() ?? "USD"}
                </Text>
                <FontAwesome
                  name="chevron-down"
                  size={ms(12)}
                  color={colors.secondary}
                />
              </Pressable>
            </View> */}

            {/* Offer List Header */}
            <View style={styles.offerHeader}>
              <Text style={styles.offerTitle}>Offer list</Text>
              <Pressable
                onPress={() => router.push("/(authentication)/create-offer")}
                style={styles.postAdBtn}
              >
                <AntDesign name="plus-square" size={17} color="#FFFA66" />
                <Text style={styles.postAdText}>Post an Ad</Text>
              </Pressable>
            </View>
          </View>
        }
        data={offerList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OfferCard
            onAction={handleTrade}
            offer={item}
            key={item.id}
            isUserDetails
          />
        )}
        ListEmptyComponent={
          offerLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={colors.accent} size={40} />
            </View>
          ) : (
            <Text style={styles.noOffersText}>
              🚫 No offers available. Try changing your filters.
            </Text>
          )
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Modals */}
      <CoinBottomSheet
        setSelectedCoin={setActiveTopCoin}
        visible={topFilterCoin}
        height={60}
        setVisible={setTopFilterCoin}
      />
      <PaymentMethodSelector
        visible={paymentMethodFilter}
        onClose={() => setPaymentMethodFilter(false)}
        onSave={setFilterPayments}
        mode="multiple"
      />
      <PreferedCurrency
        visible={preferedCoinVisible}
        onSelect={setSelectedCurrency}
        onClose={() => setPreferedCoinVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Market;

const styles = StyleSheet.create({
  topBar: { paddingHorizontal: 20, paddingVertical: 10 },
  topBarTitle: { fontWeight: "500", fontSize: ms(16), color: colors.secondary },
  topBarActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  notiContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.gray2,
  },
  btnContainer: {
    borderRadius: 100,
    width: "40%",
    backgroundColor: colors.gray2,
    flexDirection: "row",
    overflow: "hidden",
  },
  btn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },
  btnText: { color: colors.secondary, fontSize: ms(16), lineHeight: 24 },
  headerSection: { gap: 10, backgroundColor: colors.primary },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filtersRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  topBox: {
    minWidth: s(100),
    backgroundColor: colors.gray2,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
  },
  filterText: { fontSize: ms(14), color: colors.secondary },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  coinIcon: { width: 16, height: 16 },
  amountInputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  amountInput: { flex: 1, color: colors.secondary, fontSize: ms(14) },
  currencySelector: {
    backgroundColor: colors.gray2,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flagIcon: { width: 20, height: 20, borderRadius: 10 },
  currencyCode: {
    fontWeight: "500",
    fontSize: ms(14),
    color: colors.secondary,
  },
  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  offerTitle: { fontWeight: "500", fontSize: ms(14), color: colors.secondary },
  postAdBtn: {
    backgroundColor: colors.gray2,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  postAdText: { color: "#FFFA66", fontWeight: "700", fontSize: ms(14) },
  centered: { alignItems: "center", justifyContent: "center", marginTop: 20 },
  noOffersText: {
    marginTop: 20,
    textAlign: "center",
    color: colors.secondary,
    fontSize: ms(15),
    fontWeight: "500",
  },
});
