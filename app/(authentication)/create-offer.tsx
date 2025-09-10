import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/utils/globalStyles";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { colors } from "@/constants";
import { ms, s } from "react-native-size-matters";
import { router } from "expo-router";
import StepOne from "@/components/createOffer/StepOne";
import StepTwo from "@/components/createOffer/StepTwo";
import StepThree from "@/components/createOffer/StepThree";
import { SelectedCurrency } from "@/components/PreferedCurrency";
import { useCoinStore } from "@/context";
import { useAlert } from "@/components/AlertService";
import { createOffer } from "@/utils/countryStore";
import { PaymentMethod } from "@/components/SelectPaymentMethod";

const CreateOffer = () => {
  const goBack = () => {
    router.push("/market");
  };

  const { AlertComponent, showAlert } = useAlert();

  const coins = useCoinStore((state) => state.coins);
  const minutes = ["15 minutes", "30 minutes", "45 minutes", "1 hour"];

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("step-one");
  const [offerTime, setOfferTime] = useState(minutes[0]);
  const [type, setType] = useState("buy");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [margin, setMargin] = useState(0);
  const [activeOfferCoin, setActiveOfferCoin] = useState(coins[0]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [terms, setTerms] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod[]>([]);
  const [selectedCurrency, setSelectedCurrency] =
    useState<SelectedCurrency | null>(null);

  const handleCreateAd = async () => {
    if (
      !selectedCurrency ||
      !activeOfferCoin ||
      !offerTime ||
      !type ||
      !paymentMethod.length ||
      !min ||
      !max ||
      !margin
    ) {
      showAlert(
        "Error",
        "Please fill in all required fields",
        [{ onPress: () => {}, text: "Close" }],
        "error"
      );
      return;
    }

    setLoading(true);

    const offerRes = await createOffer(
      type,
      activeOfferCoin?.symbol,
      selectedCurrency?.code,
      margin,
      paymentMethod[0]?.id,
      min,
      max,
      offerTime,
      terms
    );
    setLoading(false);

    if (offerRes.success) {
      showAlert(
        "Success",
        offerRes.message || "Offer created successfully",
        [{ onPress: () => router.push("/market"), text: "Continue" }],
        "success"
      );
    } else {
      showAlert(
        "Error",
        offerRes.message || "Failed to create offer",
        [{ onPress: () => {}, text: "Close" }],
        "error"
      );
    }
  };
  return (
    <SafeAreaView style={globalStyles.container}>
      {AlertComponent}
      <View
        style={{
          flex: 1,
          backgroundColor: colors.primary,
        }}
      >
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
                fontWeight: 400,
                fontSize: ms(16),
                color: colors.secondary,
              }}
            >
              Post an Ad
            </Text>
          </Pressable>

          <View
            style={{
              backgroundColor: "#3A3A3A",
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 100,
              gap: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginHorizontal: 10,
            }}
          >
            <FontAwesome5
              name="headset"
              size={ms(14)}
              color={colors.secondary}
            />
            <Text style={{ color: colors.secondary, fontSize: ms(12) }}>
              Help
            </Text>
          </View>
        </View>
        {/* end of topbar */}

        {/* tab bar */}
        <View style={styles.tabBar}>
          <Pressable
            // onPress={() => setActiveTab("step-one")}
            style={[
              styles.tabBarItem,
              activeTab === "step-one" && styles.tabBarItemActive,
              completedSteps.includes("step-one") && {
                borderBottomColor: colors.accent,
              },
            ]}
          >
            <Text
              style={[
                styles.tabBarItemText,
                activeTab == "step-one" && { color: colors.accent },
                completedSteps.includes("step-one") && {
                  color: colors.white2,
                },
              ]}
            >
              Asset & Method
            </Text>
          </Pressable>
          <Pressable
            // onPress={() => setActiveTab("step-two")}
            style={[
              styles.tabBarItem,
              activeTab === "step-two" && styles.tabBarItemActive,
              completedSteps.includes("step-two") && {
                borderBottomColor: colors.accent,
              },
            ]}
          >
            <Text
              style={[
                styles.tabBarItemText,
                activeTab == "step-two" && { color: colors.accent },
                completedSteps.includes("step-two") && {
                  color: colors.white2,
                },
              ]}
            >
              Price & Limits
            </Text>
          </Pressable>
          <Pressable
            // onPress={() => setActiveTab("step-three")}
            style={[
              styles.tabBarItem,
              activeTab === "step-three" && styles.tabBarItemActive,
              completedSteps.includes("step-three") && {
                borderBottomColor: colors.accent,
              },
            ]}
          >
            <Text
              style={[
                styles.tabBarItemText,
                activeTab == "step-three" && { color: colors.accent },
                completedSteps.includes("step-three") && {
                  color: colors.white2,
                },
              ]}
            >
              Terms & Auto-reply
            </Text>
          </Pressable>
        </View>
        {/* end of tab bar */}

        {/* tab content */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }}
          >
            {activeTab === "step-one" && (
              <StepOne
                setActiveTab={setActiveTab}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                offerTime={offerTime}
                setOfferTime={setOfferTime}
                type={type}
                setType={setType}
                setCompletedSteps={setCompletedSteps}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                activeOfferCoin={activeOfferCoin}
                setActiveOfferCoin={setActiveOfferCoin}
              />
            )}
            {activeTab === "step-two" && (
              <StepTwo
                setCompletedSteps={setCompletedSteps}
                setActiveTab={setActiveTab}
                selectedCurrency={selectedCurrency}
                margin={margin}
                setMargin={setMargin}
                activeOfferCoin={activeOfferCoin}
                min={min}
                max={max}
                setMin={setMin}
                setMax={setMax}
              />
            )}
            {activeTab === "step-three" && (
              <StepThree
                loading={loading}
                handleCreateAd={handleCreateAd}
                terms={terms}
                setTerms={setTerms}
              />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
        {/* end of tab content */}
      </View>
    </SafeAreaView>
  );
};

export default CreateOffer;

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(5),
    marginVertical: 10,
  },
  tabBarItem: {
    paddingVertical: s(10),
    paddingHorizontal: s(15),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  tabBarItemIndicator: {
    flex: 1,
    height: 2,
  },
  tabBarItemActive: {
    borderBottomColor: "#C7C7C7",
  },
  tabBarItemText: {
    fontSize: ms(16),
    color: "#5C5C5C",
    fontWeight: "500",
    lineHeight: 24,
    textAlign: "center",
  },
});
