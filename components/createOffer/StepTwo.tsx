import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import { globalStyles } from "@/utils/globalStyles";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import {
  formatNumber,
  getCryptoPriceWithMargin,
  getCurrencyUSDPrice,
} from "@/utils/countryStore";
import CryptoPriceWithMargin from "../CryptoPriceWithMargin ";
import { SelectedCurrency } from "../PreferedCurrency";
import { CoinData } from "@/context";
import CryptoConverter from "../CurrencyPriceAmount";

interface StepTwoProps {
  margin: number;
  setMargin: (value: number) => void;
  selectedCurrency: SelectedCurrency | null; // Optional prop for selected currency
  activeOfferCoin: CoinData;
  min: number;
  max: number;
  setMin: (value: number) => void;
  setMax: (value: number) => void;
  setCompletedSteps: Dispatch<SetStateAction<string[]>>;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

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
  const MIN = -10;
  const MAX = 100;

  const handleChange = (text: string) => {
    let num = Number(text);

    if (isNaN(num)) return;

    // Snap to range immediately
    if (num < MIN) {
      setMargin(MIN);
    } else if (num > MAX) {
      setMargin(MAX);
    } else {
      setMargin(num);
    }
  };

  const handlePress = () => {
    if (!margin || !min || !max) {
      return;
    }

    setCompletedSteps((prev: string[]) => [...prev, "step-two"]);
    setActiveTab("step-three");
  };
  return (
    <>
      <View style={{ marginTop: 20 }}>
        <Text style={styles.subHeader}>
          Select the asset to trade, your payment method, and the payment time
          frame.
        </Text>
      </View>
      {/* margin */}
      <View style={{ marginTop: 20 }}>
        <Text style={styles.subHeader}>Margin (min= -10, max= 100)</Text>
        <View style={[globalStyles.sectionBox, { backgroundColor: "#222222" }]}>
          <View style={[globalStyles.sectionMain, { paddingVertical: 5 }]}>
            <TextInput
              defaultValue={margin.toString()}
              onChangeText={handleChange}
              style={{
                fontSize: ms(14),
                fontWeight: 500,
                color: colors.white2,
                flex: 1,
                paddingVertical: 10,
              }}
              placeholder="Enter margin"
              placeholderTextColor={colors.white2}
              keyboardType="numeric"
            />
            <View
              style={[
                // globalStyles.sectionBox,
                {
                  borderRadius: 50,
                  width: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 8,
                  backgroundColor: "#3A3A3A",
                },
              ]}
            >
              <Text
                style={{
                  color: colors.white2,
                  fontSize: ms(14),
                  fontWeight: 500,
                }}
              >
                %
              </Text>
            </View>
          </View>
        </View>
      </View>
      {/* end of margin */}

      {/* divider */}
      <View style={globalStyles.divider} />
      {/* end of divider */}

      <View style={{ marginTop: 20, gap: 5 }}>
        <View
          style={{
            backgroundColor: colors.gray2,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.subHeader}>Fee</Text>
          <Text style={styles.subHeader}>1%</Text>
        </View>

        <View
          style={{
            backgroundColor: colors.gray2,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.subHeader}>Market Rate</Text>
          <CryptoPriceWithMargin
            coin={activeOfferCoin.symbol?.toUpperCase()}
            margin={0}
            // info="Market Rate"
          />
        </View>

        <View
          style={{
            backgroundColor: colors.gray2,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.subHeader}>Your Rate</Text>
          <CryptoPriceWithMargin
            coin={activeOfferCoin.symbol?.toUpperCase()}
            margin={margin}
            // info="Your Rate"
          />
        </View>

        {margin == 0 && (
          <Text
            style={{ fontWeight: 500, fontSize: ms(12), color: colors.gray3 }}
          >
            *You will sell at the market price
          </Text>
        )}
        {margin > 0 && (
          <Text
            style={{ fontWeight: 500, fontSize: ms(12), color: colors.gray3 }}
          >
            *You will make a profit of {margin}% on every trade
          </Text>
        )}
        {margin < 0 && (
          <Text
            style={{ fontWeight: 500, fontSize: ms(12), color: colors.gray3 }}
          >
            *You will lose {Math.abs(margin)}% on every trade
          </Text>
        )}
      </View>

      {/* divider */}
      <View style={globalStyles.divider} />
      {/* end of divider */}

      {/* Order Limit */}
      <View style={{ marginTop: 20 }}>
        <Text style={styles.subHeader}>Order limit</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            width: "100%",
            justifyContent: "center",
            // backgroundColor: "red",
          }}
        >
          {/* min */}
          <View style={{ flex: 1 }}>
            <View
              style={[
                globalStyles.sectionBox,
                { backgroundColor: "#222222", flex: 1 },
              ]}
            >
              <View style={[globalStyles.sectionMain, { paddingVertical: 5 }]}>
                <Text
                  style={{
                    color: colors.white2,
                    fontSize: ms(14),
                    fontWeight: 500,
                  }}
                >
                  {selectedCurrency?.symbol?.toUpperCase()}
                </Text>
                <TextInput
                  style={{
                    fontSize: ms(14),
                    fontWeight: 500,
                    color: colors.white2,
                    flex: 1,
                    paddingVertical: 10,
                  }}
                  placeholder="min"
                  placeholderTextColor={colors.white2}
                  keyboardType="numeric"
                  defaultValue={min?.toString()}
                  onChangeText={(text) => setMin(Number(text))}
                />

                <Text
                  style={{
                    color: colors.white2,
                    fontSize: ms(14),
                    fontWeight: 500,
                  }}
                >
                  {selectedCurrency?.code?.toUpperCase() || "USD"}
                </Text>
              </View>
            </View>
            <CryptoConverter
              amount={min}
              coin={activeOfferCoin?.symbol || "BTC"}
              currency={selectedCurrency?.code || "USD"}
            />
          </View>

          {/* end of min */}

          {/* middle */}
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 24 / 2,
              backgroundColor: "#4DAAF2",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AntDesign name="arrowright" size={15} color="black" />
          </View>
          {/* end of middle  */}

          {/* max */}
          <View style={{ flex: 1 }}>
            <View
              style={[
                globalStyles.sectionBox,
                { backgroundColor: "#222222", flex: 1 },
              ]}
            >
              <View style={[globalStyles.sectionMain, { paddingVertical: 5 }]}>
                <Text
                  style={{
                    color: colors.white2,
                    fontSize: ms(14),
                    fontWeight: 500,
                  }}
                >
                  {selectedCurrency?.symbol?.toUpperCase()}
                </Text>
                <TextInput
                  style={{
                    fontSize: ms(14),
                    fontWeight: 500,
                    color: colors.white2,
                    flex: 1,
                    paddingVertical: 10,
                  }}
                  placeholder="max"
                  placeholderTextColor={colors.white2}
                  keyboardType="numeric"
                  defaultValue={max.toString()}
                  onChangeText={(text) => setMax(Number(text))}
                />

                <Text
                  style={{
                    color: colors.white2,
                    fontSize: ms(14),
                    fontWeight: 500,
                  }}
                >
                  {selectedCurrency?.code?.toUpperCase() || "USD"}
                </Text>
              </View>
            </View>
            <CryptoConverter
              amount={max}
              coin={activeOfferCoin?.symbol || "BTC"}
              currency={selectedCurrency?.code || "USD"}
            />
          </View>
          {/* end of max */}
        </View>
      </View>
      {/* end of Order Limit */}

      {/* read guide */}
      <Pressable
        style={{
          marginTop: 20,
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons name="menu-book" size={ms(16)} color={colors.accent} />
        <Text
          style={{
            fontSize: ms(14),
            fontWeight: 700,
            color: colors.accent,
          }}
        >
          Read our guide for creating crypto
        </Text>
      </Pressable>
      {/* end of read guide */}

      {/* submit button */}
      <Pressable
        onPress={handlePress}
        disabled={!margin || !min || !max}
        style={[
          globalStyles.btn,
          { marginTop: 20, marginBottom: 20, width: "100%" },
          !margin || !min || !max ? { opacity: 0.5 } : {},
        ]}
      >
        <Text style={globalStyles.btnText}>Continue</Text>
      </Pressable>
      {/* end of submit button */}
    </>
  );
};

export default StepTwo;
``;
const styles = StyleSheet.create({
  header: {
    fontSize: ms(22),
    fontWeight: 700,
    lineHeight: 32,
    color: colors.white2,
  },
  subHeader: {
    fontSize: ms(15),
    fontWeight: 400,
    lineHeight: 24,
    color: colors.gray4,
    marginTop: 10,
  },
});
