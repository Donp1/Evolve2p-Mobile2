import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles } from "@/utils/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants";
import { ms, s } from "react-native-size-matters";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useCoinStore } from "@/context";
import BottomSheet from "@/components/BottomSheet";
import { Image } from "expo-image";
import { createTrade, truncateText } from "@/utils/countryStore";
import PaymentMethodSelector, {
  PaymentMethod,
} from "@/components/SelectPaymentMethod";
import CoinBottomSheet from "@/components/CoinBottomSheet";
import PreferedCurrency, {
  SelectedCurrency,
} from "@/components/PreferedCurrency";
import PaymentMethodForm from "@/components/PaymentMethodForm";
import OfferLimitsSection from "@/components/margingOfferLimits";
import { router } from "expo-router";
import { Offer, useOffers } from "@/hooks/useOffers";
import OfferCard, { ActionableOffer } from "@/components/OfferCard";
import TraderProfile from "@/components/TraderProfile";
import NotificationView from "@/components/NotificationView";

const Market = () => {
  const coins = useCoinStore((state) => state.coins);

  const [section, setSection] = useState("buy");
  const [topFilterCoin, setTopFilterCoin] = useState(false);
  const [activeTopCoin, setActiveTopCoin] = useState(coins[0]);

  const [preferedCoinVisible, setPreferedCoinVisible] = useState(false);
  const [completeKycVisible, setCompleteKycVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] =
    useState<SelectedCurrency | null>(null);

  const [paymentMethodFilter, setPaymentMethodFilter] = useState(false);
  const [filterPayments, setFilterPayments] = useState<PaymentMethod[]>([]);

  const {
    offers,
    loading: offerLoading,
    error,
  } = useOffers({
    type: section,
    crypto: activeTopCoin?.symbol,
    paymentMethod: filterPayments.map((pm) => pm.id),
    currency: selectedCurrency?.code || "USD",
  });

  const handleTrade = async (id: string) => {
    router.push({
      pathname: "/trade/[id]",
      params: {
        id: id,
      },
    });
  };

  return (
    <>
      <SafeAreaView style={globalStyles.container}>
        {/* topbar */}
        <View
          style={[
            globalStyles.topBar,
            { paddingHorizontal: 20, paddingVertical: 10 },
          ]}
        >
          <Text
            style={{
              fontWeight: 500,
              fontSize: ms(16),
              color: colors.secondary,
            }}
          >
            P2P Marketplace
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
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
        {/* end of topbar */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
            backgroundColor: colors.primary,
            flexGrow: 1,
            paddingHorizontal: 10,
          }}
        >
          <View
            style={[
              globalStyles.sectionBox,
              {
                borderRadius: 0,
                marginTop: 0,
                paddingHorizontal: 0,
                backgroundColor: colors.primary,
                gap: 10,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={styles.btnContainer}>
                <Pressable
                  onPress={() => setSection("buy")}
                  style={[
                    styles.btn,
                    section == "buy" && { backgroundColor: colors.gray },
                  ]}
                >
                  <Text
                    style={[
                      styles.btnText,
                      section == "buy" && {
                        fontWeight: 500,
                        color: colors.white2,
                      },
                    ]}
                  >
                    Buy
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setSection("sell")}
                  style={[
                    styles.btn,
                    section == "sell" && { backgroundColor: colors.gray },
                  ]}
                >
                  <Text
                    style={[
                      styles.btnText,
                      section == "sell" && {
                        fontWeight: 500,
                        color: colors.white2,
                      },
                    ]}
                  >
                    Sell
                  </Text>
                </Pressable>
              </View>

              <Pressable
                // onPress={() => setCreateOfferBottomSheet(true)}
                style={[
                  styles.notiContainer,
                  { flexDirection: "row", alignItems: "center", gap: 10 },
                ]}
              >
                <Ionicons
                  name="reload"
                  size={ms(17)}
                  color={colors.secondary}
                />
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 10,
                width: "100%",
              }}
            >
              {/* coin filter */}
              <Pressable
                onPress={() => setTopFilterCoin(true)}
                style={[styles.topBox, { flex: 2 }]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // gap: 5,
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    source={{ uri: activeTopCoin.image }}
                    style={{ width: 16, height: 16 }}
                  />
                  <Text
                    style={{
                      fontWeight: 400,
                      fontSize: ms(14),
                      color: colors.secondary,
                    }}
                  >
                    {activeTopCoin.symbol?.toUpperCase()}
                  </Text>
                  <Entypo
                    name="chevron-small-down"
                    size={24}
                    color={colors.white}
                  />
                </View>
              </Pressable>

              {/* payment filter */}
              <Pressable
                onPress={() => setPaymentMethodFilter(true)}
                style={[styles.topBox, { flex: 2 }]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // gap: 5,
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 400,
                      fontSize: ms(14),
                      color: colors.secondary,
                    }}
                  >
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
            </ScrollView>

            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 5,
                borderWidth: 1,
                borderColor: "#222",
                // marginHorizontal: 20,
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  color: colors.secondary,
                  fontSize: ms(14),
                  fontWeight: 400,
                }}
                placeholder={`Enter ${selectedCurrency?.code} Amount`}
                placeholderTextColor={colors.secondary}
                keyboardType="numeric"
              />
              <Pressable
                onPress={() => setPreferedCoinVisible((c) => !c)}
                style={{
                  backgroundColor: colors.gray2,
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  borderRadius: 100,
                  gap: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{
                    uri: selectedCurrency?.flag,
                  }}
                  style={{ width: 20, height: 20, borderRadius: 10 }}
                />

                <Text
                  style={{
                    fontWeight: 500,
                    fontSize: ms(14),
                    color: colors.secondary,
                  }}
                >
                  {selectedCurrency?.code.toUpperCase()}
                </Text>
                <FontAwesome
                  name="chevron-down"
                  size={ms(12)}
                  color={colors.secondary}
                />
              </Pressable>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: ms(14),
                  color: colors.secondary,
                }}
              >
                Offer list
              </Text>
              <Pressable
                onPress={() => router.push("/(authentication)/create-offer")}
                style={{
                  backgroundColor: colors.gray2,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  borderRadius: 100,
                  gap: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AntDesign name="pluscircle" size={17} color="#FFFA66" />
                <Text
                  style={{
                    color: "#FFFA66",
                    fontWeight: 700,
                    fontSize: ms(14),
                  }}
                >
                  Post an Ad
                </Text>
              </Pressable>
            </View>
          </View>

          {offerLoading ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <ActivityIndicator color={colors.accent} size={40} />
            </View>
          ) : (
            <>
              {(offers?.data?.length ?? 0) <= 0 ? (
                <View>
                  <Text
                    style={{
                      marginTop: 20,
                      textAlign: "center",
                      color: colors.secondary,
                      fontSize: ms(15),
                      fontWeight: 500,
                    }}
                  >
                    🚫 No offers available. Try changing your filters.
                  </Text>
                </View>
              ) : (
                <>
                  {offers?.data?.map((offer) => (
                    <OfferCard
                      onAction={handleTrade}
                      key={offer.id}
                      offer={offer}
                      isUserDetails={true}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
      {/* coin */}
      <CoinBottomSheet
        setSelectedCoin={setActiveTopCoin}
        visible={topFilterCoin}
        height={60}
        setVisible={setTopFilterCoin}
      />

      {/* payment */}
      <PaymentMethodSelector
        visible={paymentMethodFilter}
        onClose={() => setPaymentMethodFilter(false)}
        onSave={(selected) => {
          setFilterPayments(selected);
        }}
        mode="multiple"
      />

      <PreferedCurrency
        visible={preferedCoinVisible}
        onSelect={setSelectedCurrency}
        onClose={() => setPreferedCoinVisible(false)}
      />
    </>
  );
};

export default Market;

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
  btnContainer: {
    borderRadius: 100,
    width: "40%",
    backgroundColor: colors.gray2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  btn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    borderRadius: 100,
  },
  btnText: {
    color: colors.secondary,
    fontWeight: 400,
    fontSize: ms(16),
    lineHeight: 24,
  },
  topBox: {
    minWidth: s(100),
    backgroundColor: colors.gray2,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
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
});
