import React, { Dispatch, SetStateAction, useState, useMemo, useCallback } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import { globalStyles } from "@/utils/globalStyles";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";

import CoinBottomSheet from "../CoinBottomSheet";
import PreferedCurrency, { SelectedCurrency } from "@/components/PreferedCurrency";
import BottomSheet from "../BottomSheet";
import PaymentMethodSelector, { PaymentMethod } from "../SelectPaymentMethod";
import { CoinData } from "@/context";

interface StepOneProps {
  selectedCurrency: SelectedCurrency | null;
  setSelectedCurrency: (currency: SelectedCurrency | null) => void;
  activeOfferCoin: CoinData;
  setActiveOfferCoin: Dispatch<SetStateAction<CoinData>>;
  setCompletedSteps: Dispatch<SetStateAction<string[]>>;
  type: string;
  setType: (type: string) => void;
  offerTime: string;
  setOfferTime: (time: string) => void;
  paymentMethod: PaymentMethod[];
  setPaymentMethod: (method: PaymentMethod[]) => void;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const StepOne: React.FC<StepOneProps> = ({
  selectedCurrency,
  setSelectedCurrency,
  activeOfferCoin,
  setActiveOfferCoin,
  setCompletedSteps,
  type,
  setType,
  offerTime,
  setOfferTime,
  paymentMethod,
  setPaymentMethod,
  setActiveTab,
}) => {
  const minutes = useMemo(() => ["15 minutes", "30 minutes", "45 minutes", "1 hour"], []);

  const [showOfferTime, setShowOfferTime] = useState(false);
  const [offerCoin, setOfferCoin] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [preferedCoinVisible, setPreferedCoinVisible] = useState(false);

  const isDisabled = !activeOfferCoin || !selectedCurrency || paymentMethod.length === 0 || !type || !offerTime;

  const handleContinue = useCallback(() => {
    if (isDisabled) return;

    setCompletedSteps((prev) => [...prev, "step-one"]);
    setActiveTab("step-two");
  }, [isDisabled, setCompletedSteps, setActiveTab]);

  return (
    <>
      <View style={styles.wrapper}>
        {/* Header */}
        <Text style={styles.header}>Create an Ad</Text>
        <Text style={styles.subHeader}>
          Select the asset to trade, your payment method, and the payment time frame.
        </Text>

        {/* Buy / Sell */}
        <View style={styles.section}>
          <Text style={styles.label}>I want to</Text>
          <View style={styles.btnContainer}>
            {["buy", "sell"].map((option) => (
              <Pressable
                key={option}
                accessible
                accessibilityRole="button"
                onPress={() => setType(option)}
                style={[styles.btn, type === option && { backgroundColor: colors.gray }]}
              >
                <Text style={[styles.btnText, type === option && styles.btnTextActive]}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Crypto & Fiat */}
        <View style={styles.row}>
          {/* Crypto */}
          <View style={styles.flex1}>
            <Text style={styles.label}>Cryptocurrency</Text>
            <Pressable
              accessible
              accessibilityRole="button"
              onPress={() => setOfferCoin(true)}
              style={globalStyles.sectionBox}
            >
              <View style={[globalStyles.sectionMain, styles.rowCenter]}>
                <Image
                  source={activeOfferCoin?.image ? { uri: activeOfferCoin.image } : undefined}
                  style={styles.icon}
                  priority="high"
                />
                <Text style={styles.valueText}>
                  {activeOfferCoin?.symbol?.toUpperCase() || "--"}
                </Text>
                <FontAwesome name="chevron-down" size={ms(14)} color={colors.gray4} />
              </View>
            </Pressable>
          </View>

          {/* Fiat */}
          <View style={styles.flex1}>
            <Text style={styles.label}>with Fiat</Text>
            <Pressable
              accessible
              accessibilityRole="button"
              onPress={() => setPreferedCoinVisible(true)}
              style={globalStyles.sectionBox}
            >
              <View style={[globalStyles.sectionMain, styles.rowCenter]}>
                <Image
                  source={selectedCurrency?.flag ? { uri: selectedCurrency.flag } : undefined}
                  style={styles.icon}
                  priority="high"
                />
                <Text style={styles.valueText}>{selectedCurrency?.code?.toUpperCase() || "--"}</Text>
                <FontAwesome name="chevron-down" size={ms(14)} color={colors.gray4} />
              </View>
            </Pressable>
          </View>
        </View>

        {/* Payment method */}
        <View style={styles.section}>
          <Text style={styles.label}>Payment method</Text>
          <Pressable
            accessible
            accessibilityRole="button"
            onPress={() => setShowPaymentMethod(true)}
            style={globalStyles.sectionBox}
          >
            <View style={globalStyles.sectionMain}>
              <Text style={styles.valueText}>
                {paymentMethod[0]?.name || "Select payment method"}
              </Text>
              <FontAwesome name="chevron-down" size={ms(14)} color={colors.gray4} />
            </View>
          </Pressable>
        </View>

        {/* Payment time */}
        <View style={styles.section}>
          <Text style={styles.label}>Payment time limit</Text>
          <Pressable
            accessible
            accessibilityRole="button"
            onPress={() => setShowOfferTime(true)}
            style={globalStyles.sectionBox}
          >
            <View style={[globalStyles.sectionMain, styles.rowBetween]}>
              <Text style={styles.valueText}>{offerTime}</Text>
              <FontAwesome name="chevron-down" size={ms(14)} color={colors.gray4} />
            </View>
          </Pressable>
        </View>

        {/* Guide */}
        <Pressable style={styles.guideBtn} accessible accessibilityRole="link">
          <MaterialIcons name="menu-book" size={ms(16)} color={colors.accent} />
          <Text style={styles.guideText}>Read our guide for creating crypto</Text>
        </Pressable>

        {/* Continue button */}
        <Pressable
          onPress={handleContinue}
          disabled={isDisabled}
          style={[globalStyles.btn, styles.continueBtn, { opacity: isDisabled ? 0.5 : 1 }]}
        >
          <Text style={globalStyles.btnText}>Continue</Text>
        </Pressable>
      </View>

      {/* Bottom sheets */}
      <CoinBottomSheet
        height={60}
        visible={offerCoin}
        setVisible={setOfferCoin}
        setSelectedCoin={setActiveOfferCoin}
      />
      <PreferedCurrency
        visible={preferedCoinVisible}
        onSelect={setSelectedCurrency}
        onClose={() => setPreferedCoinVisible(false)}
      />
      <BottomSheet visible={showOfferTime} setVisible={setShowOfferTime}>
        <Text style={styles.label}>Payment time limit</Text>
        {minutes.map((minute) => (
          <Pressable
            key={minute}
            onPress={() => {
              setOfferTime(minute);
              setShowOfferTime(false);
            }}
            style={globalStyles.sectionBox}
          >
            <View style={[globalStyles.sectionMain, styles.rowBetween]}>
              <Text style={styles.valueText}>{minute}</Text>
              <Ionicons
                name={offerTime === minute ? "radio-button-on-outline" : "radio-button-off-outline"}
                size={24}
                color={offerTime === minute ? colors.accent : colors.gray}
              />
            </View>
          </Pressable>
        ))}
      </BottomSheet>
      <PaymentMethodSelector
        visible={showPaymentMethod}
        onClose={() => setShowPaymentMethod(false)}
        onSave={setPaymentMethod}
        mode="single"
      />
    </>
  );
};

export default StepOne;

const styles = StyleSheet.create({
  wrapper: { marginTop: 20 },
  header: { fontSize: ms(22), fontWeight: "700", lineHeight: 32, color: colors.white2 },
  subHeader: { fontSize: ms(15), fontWeight: "400", lineHeight: 24, color: colors.gray4, marginTop: 10 },
  section: { marginTop: 15 },
  label: { fontSize: ms(14), fontWeight: "500", color: colors.gray4 },
  row: { flexDirection: "row", gap: 15, alignItems: "center", marginTop: 15 },
  flex1: { flex: 1 },
  rowCenter: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },
  btnContainer: { borderRadius: 100, width: "100%", backgroundColor: colors.gray2, flexDirection: "row", overflow: "hidden", marginTop: 10 },
  btn: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 5 },
  btnText: { color: colors.secondary, fontWeight: "400", fontSize: ms(16), lineHeight: 24 },
  btnTextActive: { fontWeight: "500", color: colors.white2 },
  valueText: { fontSize: ms(14), fontWeight: "500", color: colors.white2 },
  icon: { width: ms(25), height: ms(25), borderRadius: 10 },
  guideBtn: { marginTop: 20, flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center" },
  guideText: { fontSize: ms(14), fontWeight: "700", color: colors.accent },
  continueBtn: { marginTop: 20, marginBottom: 20, width: "100%" },
});
