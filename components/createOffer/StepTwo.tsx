import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import { globalStyles } from "@/utils/globalStyles";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SelectedCurrency } from "../PreferedCurrency";
import { CoinData } from "@/context";
import CryptoConverter from "../CurrencyPriceAmount";
import CryptoPriceWithMargin from "../CryptoPriceWithMargin ";

interface StepTwoProps {
  margin: number;
  setMargin: (value: number) => void;
  selectedCurrency: SelectedCurrency | null;
  activeOfferCoin: CoinData;
  min: number;
  max: number;
  setMin: (value: number) => void;
  setMax: (value: number) => void;
  setCompletedSteps: Dispatch<SetStateAction<string[]>>;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const MIN_MARGIN = -10;
const MAX_MARGIN = 100;

const StepTwo: React.FC<StepTwoProps> = ({
  margin,
  setMargin,
  selectedCurrency,
  activeOfferCoin,
  min,
  max,
  setMin,
  setMax,
  setCompletedSteps,
  setActiveTab,
}) => {
  const handleChange = useCallback(
    (text: string) => {
      const num = parseFloat(text.replace(/[^0-9.-]/g, "")); // strip invalid chars
      if (isNaN(num)) return;

      // Clamp value
      setMargin(Math.min(Math.max(num, MIN_MARGIN), MAX_MARGIN));
    },
    [setMargin]
  );

  const handlePress = useCallback(() => {
    if (margin && min && max) {
      setCompletedSteps((prev) => [...prev, "step-two"]);
      setActiveTab("step-three");
    }
  }, [margin, min, max, setCompletedSteps, setActiveTab]);

  const isButtonDisabled = useMemo(() => !margin || !min || !max, [margin, min, max]);

  return (
    <>
      <View style={{ marginTop: 20 }}>
        <Text style={styles.subHeader}>
          Select the asset to trade, your payment method, and the payment time frame.
        </Text>
      </View>

      {/* Margin */}
      <View style={{ marginTop: 20 }}>
        <Text style={styles.subHeader}>Margin (min= -10, max= 100)</Text>
        <View style={[globalStyles.sectionBox, { backgroundColor: "#222222" }]}>
          <View style={[globalStyles.sectionMain, { paddingVertical: 5 }]}>
            <TextInput
              value={String(margin)}
              onChangeText={handleChange}
              style={styles.input}
              placeholder="Enter margin"
              placeholderTextColor={colors.white2}
              keyboardType="numeric"
            />
            <View style={styles.percentBox}>
              <Text style={styles.percentText}>%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={globalStyles.divider} />

      {/* Fee, Market & Your Rate */}
      <View style={{ marginTop: 20, gap: 5 }}>
        <InfoRow label="Fee" value="1%" />
        <InfoRow
          label="Market Rate"
          value={<CryptoPriceWithMargin coin={activeOfferCoin.symbol?.toUpperCase()} margin={0} />}
        />
        <InfoRow
          label="Your Rate"
          value={<CryptoPriceWithMargin coin={activeOfferCoin.symbol?.toUpperCase()} margin={margin} />}
        />

        {margin === 0 && <HelperText text="*You will sell at the market price" />}
        {margin > 0 && <HelperText text={`*You will make a profit of ${margin}% on every trade`} />}
        {margin < 0 && <HelperText text={`*You will lose ${Math.abs(margin)}% on every trade`} />}
      </View>

      <View style={globalStyles.divider} />

      {/* Order Limit */}
      <View style={{ marginTop: 20 }}>
        <Text style={styles.subHeader}>Order limit</Text>
        <View style={styles.orderLimitRow}>
          <LimitInput
            label={selectedCurrency?.symbol?.toUpperCase()}
            value={min}
            onChange={(val) => setMin(val)}
            currency={selectedCurrency?.code}
            coin={activeOfferCoin.symbol}
            placeholder="min"
          />
          <View style={styles.arrow}>
            <AntDesign name="arrow-right" size={15} color="black" />
          </View>
          <LimitInput
            label={selectedCurrency?.symbol?.toUpperCase()}
            value={max}
            onChange={(val) => setMax(val)}
            currency={selectedCurrency?.code}
            coin={activeOfferCoin.symbol}
            placeholder="max"
          />
        </View>
      </View>

      {/* Read Guide */}
      <Pressable style={styles.readGuide}>
        <MaterialIcons name="menu-book" size={ms(16)} color={colors.accent} />
        <Text style={styles.readGuideText}>Read our guide for creating crypto</Text>
      </Pressable>

      {/* Continue Button */}
      <Pressable
        onPress={handlePress}
        disabled={isButtonDisabled}
        style={[
          globalStyles.btn,
          { marginTop: 20, marginBottom: 20, width: "100%" },
          isButtonDisabled && { opacity: 0.5 },
        ]}
      >
        <Text style={globalStyles.btnText}>Continue</Text>
      </Pressable>
    </>
  );
};

export default StepTwo;

/* ------------------------- Helper Components ------------------------- */
const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <View style={styles.infoRow}>
    <Text style={styles.subHeader}>{label}</Text>
    {typeof value === "string" ? <Text style={styles.subHeader}>{value}</Text> : value}
  </View>
);

const HelperText = ({ text }: { text: string }) => (
  <Text style={styles.helperText}>{text}</Text>
);

const LimitInput = ({
  label,
  value,
  onChange,
  currency,
  coin,
  placeholder,
}: {
  label?: string;
  value: number;
  onChange: (val: number) => void;
  currency?: string;
  coin?: string;
  placeholder: string;
}) => {
  const handleChange = (text: string) => {
    const num = parseFloat(text.replace(/[^0-9.-]/g, ""));
    if (!isNaN(num)) onChange(num);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={[globalStyles.sectionBox, { backgroundColor: "#222222" }]}>
        <View style={[globalStyles.sectionMain, { paddingVertical: 5 }]}>
          <Text style={styles.inputLabel}>{label}</Text>
          <TextInput
            value={String(value)}
            onChangeText={handleChange}
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={colors.white2}
            keyboardType="numeric"
          />
          <Text style={styles.inputLabel}>{currency?.toUpperCase() || "USD"}</Text>
        </View>
      </View>
      <CryptoConverter amount={value} coin={coin || "BTC"} currency={currency || "USD"} />
    </View>
  );
};

/* ------------------------- Styles ------------------------- */
const styles = StyleSheet.create({
  subHeader: {
    fontSize: ms(15),
    fontWeight: "400",
    lineHeight: 24,
    color: colors.gray4,
    marginTop: 10,
  },
  input: {
    fontSize: ms(14),
    fontWeight: "500",
    color: colors.white2,
    flex: 1,
    paddingVertical: 10,
  },
  percentBox: {
    borderRadius: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    backgroundColor: "#3A3A3A",
  },
  percentText: {
    color: colors.white2,
    fontSize: ms(14),
    fontWeight: "500",
  },
  infoRow: {
    backgroundColor: colors.gray2,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  helperText: {
    fontWeight: "500",
    fontSize: ms(12),
    color: colors.gray3,
  },
  orderLimitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    justifyContent: "center",
  },
  arrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4DAAF2",
    alignItems: "center",
    justifyContent: "center",
  },
  inputLabel: {
    color: colors.white2,
    fontSize: ms(14),
    fontWeight: "500",
  },
  readGuide: {
    marginTop: 20,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  readGuideText: {
    fontSize: ms(14),
    fontWeight: "700",
    color: colors.accent,
  },
});
