import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import { globalStyles } from "@/utils/globalStyles";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import CoinBottomSheet from "../CoinBottomSheet";
import { CoinData, useCoinStore } from "@/context";
import { Image } from "expo-image";
import PreferedCurrency, {
  SelectedCurrency,
} from "@/components/PreferedCurrency";
import BottomSheet from "../BottomSheet";
import PaymentMethodSelector, { PaymentMethod } from "../SelectPaymentMethod";

interface StepOneProps {
  selectedCurrency: SelectedCurrency | null;
  setSelectedCurrency: (currency: SelectedCurrency | null) => void;
  offerCoin?: boolean; // Optional prop to control offer coin visibility
  setOfferCoin?: (visible: boolean) => void; // Optional prop to control offer coin visibility
  activeOfferCoin: CoinData; // The currently selected offer coin
  setActiveOfferCoin: Dispatch<SetStateAction<CoinData>>; // Function to set the active offer coin
  setCompletedSteps: Dispatch<SetStateAction<string[]>>; // Function to set completed steps
  type: string; // Type of offer, e.g., "buy" or "sell"
  setType: (type: string) => void; // Function to set the type of offer
  offerTime: string; // Optional prop for offer time
  setOfferTime: (time: string) => void; // Optional function to set offer time
  paymentMethod: PaymentMethod[]; // Optional prop for payment method
  setPaymentMethod: (method: PaymentMethod[]) => void; // Optional function to set payment method
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
  const minutes = ["15 minutes", "30 minutes", "45 minutes", "1 hour"];
  const [showOfferTime, setShowOfferTime] = useState(false);
  const [offerCoin, setOfferCoin] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [isEnabled, setIsEnabled] = useState(
    !activeOfferCoin ||
      !selectedCurrency ||
      paymentMethod.length === 0 ||
      !type ||
      !offerTime
  );

  const [preferedCoinVisible, setPreferedCoinVisible] = useState(false);

  const hanndlePress = () => {
    if (
      !activeOfferCoin ||
      !selectedCurrency ||
      paymentMethod.length === 0 ||
      !type ||
      !offerTime
    ) {
      return;
    }

    setCompletedSteps((prev: string[]) => [...prev, "step-one"]);
    setActiveTab("step-two");
  };

  return (
    <>
      <View style={{ marginTop: 20 }}>
        <View>
          <Text style={styles.header}>Create an Ad</Text>
          <Text style={styles.subHeader}>
            Select the asset to trade, your payment method, and the payment time
            frame.
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text
            style={{ fontSize: ms(14), fontWeight: 500, color: colors.gray4 }}
          >
            I want to
          </Text>
          <View style={styles.btnContainer}>
            <Pressable
              onPress={() => setType("buy")}
              style={[
                styles.btn,
                type == "buy" && { backgroundColor: colors.gray },
              ]}
            >
              <Text
                style={[
                  styles.btnText,
                  type == "buy" && {
                    fontWeight: 500,
                    color: colors.white2,
                  },
                ]}
              >
                Buy
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setType("sell")}
              style={[
                styles.btn,
                type == "sell" && { backgroundColor: colors.gray },
              ]}
            >
              <Text
                style={[
                  styles.btnText,
                  type == "sell" && {
                    fontWeight: 500,
                    color: colors.white2,
                  },
                ]}
              >
                Sell
              </Text>
            </Pressable>
          </View>
        </View>

        <View
          style={{
            marginTop: 15,
            flexDirection: "row",
            gap: 15,
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: ms(14),
                fontWeight: 500,
                color: colors.gray4,
              }}
            >
              Cryptocurrency
            </Text>
            <Pressable
              onPress={() => {
                setOfferCoin(true);
              }}
              style={globalStyles.sectionBox}
            >
              <View style={[globalStyles.sectionMain, { paddingVertical: 10 }]}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Image
                    source={{ uri: activeOfferCoin?.image }}
                    style={{
                      width: ms(25),
                      height: ms(25),
                      borderRadius: 10,
                    }}
                    priority={"high"}
                  />
                  <Text
                    style={{
                      fontSize: ms(14),
                      fontWeight: 500,
                      color: colors.white2,
                    }}
                  >
                    {activeOfferCoin?.symbol?.toUpperCase()}
                  </Text>
                </View>
                <FontAwesome
                  name="chevron-down"
                  size={ms(14)}
                  color={colors.gray4}
                />
              </View>
            </Pressable>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: ms(14),
                fontWeight: 500,
                color: colors.gray4,
              }}
            >
              with Fiat
            </Text>
            <Pressable
              onPress={() => setPreferedCoinVisible(true)}
              style={globalStyles.sectionBox}
            >
              <View style={[globalStyles.sectionMain, { paddingVertical: 10 }]}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Image
                    source={{ uri: selectedCurrency?.flag }}
                    style={{
                      width: ms(23),
                      height: ms(23),
                      borderRadius: 10,
                    }}
                    priority={"high"}
                  />
                  <Text
                    style={{
                      fontSize: ms(14),
                      fontWeight: 500,
                      color: colors.white2,
                    }}
                  >
                    {selectedCurrency?.code?.toUpperCase()}
                  </Text>
                </View>
                <FontAwesome
                  name="chevron-down"
                  size={ms(14)}
                  color={colors.gray4}
                />
              </View>
            </Pressable>
          </View>
        </View>

        <View style={{ marginTop: 15 }}>
          <Text
            style={{
              fontSize: ms(14),
              fontWeight: 500,
              color: colors.gray4,
            }}
          >
            Payment method
          </Text>
          <Pressable
            onPress={() => setShowPaymentMethod(true)}
            style={[globalStyles.sectionBox]}
          >
            <View style={globalStyles.sectionMain}>
              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: 500,
                  color: colors.gray4,
                }}
              >
                {paymentMethod[0]?.name || "Select payment method"}
              </Text>
              <FontAwesome
                name="chevron-down"
                size={ms(14)}
                color={colors.gray4}
              />
            </View>
          </Pressable>
        </View>

        <View style={{ marginTop: 15 }}>
          <Text
            style={{
              fontSize: ms(14),
              fontWeight: 500,
              color: colors.gray4,
            }}
          >
            Payment time limit
          </Text>
          <Pressable
            onPress={() => setShowOfferTime(true)}
            style={globalStyles.sectionBox}
          >
            <View
              style={[
                globalStyles.sectionMain,
                { paddingVertical: 10, justifyContent: "space-between" },
              ]}
            >
              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: 500,
                  color: colors.gray4,
                }}
              >
                {offerTime}
              </Text>
              <FontAwesome
                name="chevron-down"
                size={ms(14)}
                color={colors.gray4}
              />
            </View>
          </Pressable>
        </View>

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
          onPress={hanndlePress}
          disabled={
            !activeOfferCoin ||
            !selectedCurrency ||
            paymentMethod.length === 0 ||
            !type ||
            !offerTime
          }
          style={[
            globalStyles.btn,
            {
              marginTop: 20,
              marginBottom: 20,
              width: "100%",
              opacity:
                !activeOfferCoin ||
                !selectedCurrency ||
                paymentMethod.length === 0 ||
                !type ||
                !offerTime
                  ? 0.5
                  : 1,
            },
          ]}
        >
          <Text style={globalStyles.btnText}>Continue</Text>
        </Pressable>
        {/* end of submit button */}
      </View>

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

      {/* offer Time */}
      <BottomSheet setVisible={setShowOfferTime} visible={showOfferTime}>
        <Text
          style={{
            fontSize: ms(14),
            fontWeight: 500,
            color: colors.gray4,
          }}
        >
          Payment time limit
        </Text>

        {minutes.map((minute, index) => (
          <Pressable
            onPress={() => {
              setOfferTime(minute);
              setShowOfferTime(false);
            }}
            style={globalStyles.sectionBox}
            key={index}
          >
            <View style={[globalStyles.sectionMain, { paddingVertical: 10 }]}>
              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: 500,
                  color: colors.gray4,
                }}
              >
                {minute}
              </Text>

              {offerTime === minute ? (
                <Ionicons
                  name="radio-button-on-outline"
                  size={24}
                  color={colors.accent}
                />
              ) : (
                <Ionicons
                  name="radio-button-off-outline"
                  size={24}
                  color={colors.gray}
                />
              )}
            </View>
          </Pressable>
        ))}
      </BottomSheet>
      {/* end of offerTime */}

      {/* payment */}
      <PaymentMethodSelector
        visible={showPaymentMethod}
        onClose={() => setShowPaymentMethod(false)}
        onSave={(selected) => {
          setPaymentMethod(selected);
        }}
        mode="single"
      />
    </>
  );
};

export default StepOne;

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
  btnContainer: {
    borderRadius: 100,
    width: "100%",
    backgroundColor: colors.gray2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    marginTop: 10,
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
});
