import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { colors } from "@/constants";
import { ms, s, vs } from "react-native-size-matters";
import { globalStyles } from "@/utils/globalStyles";
import {
  AntDesign,
  Entypo,
  EvilIcons,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useCoinPriceStore, useCoinStore } from "@/context";
import { Image } from "expo-image";
import {
  formatNumber,
  markAsPaid,
  priceFormater,
  releaseCrypto,
} from "@/utils/countryStore";
import TradeStatus from "../TradeStatus";
import { useAlert } from "../AlertService";
import { Link, useRouter } from "expo-router";
import { useCountdown } from "@/hooks/useCountdown";
import TraderProfile from "../TraderProfile";
import { useUserStore } from "@/store/userStore";

interface pageProps {
  currentTrade: any;
  tradeId: string;
  type: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  setCompletedSteps: Dispatch<SetStateAction<string[]>>;
  setIsOpenChat: Dispatch<SetStateAction<boolean>>;
}
const StepOne = ({
  currentTrade,
  tradeId,
  setActiveTab,
  setCompletedSteps,
  setIsOpenChat,
  type,
}: pageProps) => {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const actionLabel =
    currentTrade?.offer.type.toLowerCase() === "sell" ? "Buy" : "Sell";
  const coins = useCoinStore((state) => state.coins);

  const user = useUserStore((state) => state.user);

  const [showTradeDetails, setShowTradeDetails] = useState(false);

  const currentCoin = coins.find(
    (c) => c.symbol?.toUpperCase() == currentTrade?.offer?.crypto
  );

  const { isExpired, minutes, seconds } = useCountdown(currentTrade?.expiresAt);

  const { AlertComponent, showAlert } = useAlert();

  const handlePaid = async () => {
    setIsPaying(true);

    const res = await markAsPaid(tradeId);

    if (res?.error) {
      showAlert(
        "Error",
        res?.message,
        [{ text: "Close", onPress() {} }],
        "error"
      );
      setIsPaying(false);
      return;
    }

    if (res?.success) {
      showAlert(
        "Successful",
        res?.message,
        [
          {
            text: "Continue",
            onPress() {
              setActiveTab("step-two");
              setCompletedSteps((tabs) => [...tabs, "step-one"]);
            },
          },
        ],
        "success"
      );
      setIsPaying(false);
    }
  };

  const handleRelease = async () => {
    setIsPaying(true);

    const res = await releaseCrypto(tradeId);

    if (res?.error) {
      showAlert(
        "Error",
        res?.message,
        [{ text: "Close", onPress() {} }],
        "error"
      );
      setIsPaying(false);
      return;
    }

    if (res?.success) {
      showAlert(
        "Successful",
        res?.message,
        [
          {
            text: "Continue",
            onPress() {
              setActiveTab("step-two");
              setCompletedSteps((tabs) => [...tabs, "step-one"]);
            },
          },
        ],
        "success"
      );
      setIsPaying(false);
    }
  };

  const handleGoToChat = () => {
    setIsOpenChat(true);
  };

  return (
    <View style={styles.container}>
      {AlertComponent}
      <View style={styles.flexContainer}>
        <View>
          <Text style={styles.headingText}>
            Order{" "}
            {currentTrade?.status == "CANCELLED"
              ? "Cancelled"
              : currentTrade?.status == "PENDING"
              ? "Created"
              : ""}
          </Text>
          {/* <Text style={styles.subHeadingText}>
            Order ID: E2P-2453019273001180
          </Text> */}
        </View>

        <View
          style={[
            {
              borderRadius: 50,
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              paddingHorizontal: 5,
              backgroundColor: "#3A3A3A",
              width: s(80),
              height: vs(25),
              justifyContent: "center",
            },
          ]}
        >
          <Ionicons name="timer-outline" size={16} color={colors.gray4} />
          <Text
            style={{
              fontSize: ms(14),
              fontWeight: "500",
              color: isExpired
                ? "red" // ⛔ expired
                : minutes < 1
                ? "orange" // ⚠️ almost done
                : colors.secondary, // ✅ normal
            }}
          >
            {isExpired
              ? "Expired"
              : `${minutes}:${seconds.toString().padStart(2, "0")}`}
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontSize: ms(16),
          fontWeight: 400,
          color: colors.secondary,
          lineHeight: 24,
          marginTop: 10,
        }}
      >
        {type == "seller"
          ? "Open chat to share payment details and wait for Buyer’s Payment . Once done, mark as recieved to continue."
          : "Open chat to get payment details and pay the seller. Once done, mark as paid to continue."}
      </Text>

      <Pressable
        onPress={handleGoToChat}
        style={[
          globalStyles.sectionBox,
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 100,
            gap: 10,
            paddingVertical: 15,
            marginTop: 20,
          },
        ]}
      >
        <Ionicons
          name="chatbubble-ellipses-sharp"
          size={20}
          color={colors.white2}
        />
        <Text
          style={{
            fontSize: ms(14),
            fontWeight: 700,
            color: colors.white2,
          }}
        >
          Open Chat
        </Text>
        <Entypo name="chevron-small-right" size={20} color={colors.gray4} />
      </Pressable>

      <View style={{ marginTop: 20, gap: 10 }}>
        <Text
          style={{
            fontSize: ms(14),
            fontWeight: 700,
            color: colors.white2,
            lineHeight: 24,
          }}
        >
          Trade Summary {currentTrade?.cryptoAmount}
        </Text>
        <View style={{ gap: 3 }}>
          <View style={styles.top}>
            <Text
              style={{
                fontWeight: 400,
                fontSize: ms(14),
                color: colors.secondary,
              }}
            >
              {actionLabel}ing
            </Text>
            <View
              style={[
                {
                  borderRadius: 100,
                  backgroundColor: "#3A3A3A",

                  alignItems: "center",
                  flexDirection: "row",
                  gap: 5,
                  paddingEnd: 10,
                  padding: 5,
                },
              ]}
            >
              <Image
                source={{ uri: currentCoin?.image }}
                style={{ width: ms(16), height: ms(16) }}
              />
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: ms(12),
                  color: colors.secondary,
                }}
              >
                {currentCoin?.symbol?.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.middle}>
            <Text
              style={{
                fontWeight: 400,
                fontSize: ms(14),
                color: colors.secondary,
              }}
            >
              Fiat Amount
            </Text>
            <View
              style={[
                {
                  borderRadius: 100,
                  backgroundColor: "#3A3A3A",

                  alignItems: "center",
                  flexDirection: "row",
                  gap: 5,
                  paddingEnd: 10,
                  padding: 5,
                },
              ]}
            >
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: ms(12),
                  color: colors.secondary,
                }}
              >
                {currentTrade?.offer?.currency}{" "}
                {formatNumber(currentTrade?.amountFiat)}
              </Text>
            </View>
          </View>
          <View style={styles.middle}>
            <Text
              style={{
                fontWeight: 400,
                fontSize: ms(14),
                color: colors.secondary,
              }}
            >
              {currentTrade?.offer?.type == "SELL" &&
              currentTrade?.seller?.id == user?.id
                ? "Buyer"
                : currentTrade?.offer?.type == "SELL" &&
                  currentTrade?.seller?.id != user?.id
                ? "Seller"
                : currentTrade?.offer?.type == "BUY" &&
                  currentTrade?.seller?.id == user?.id
                ? "Seller"
                : currentTrade?.offer?.type == "BUY" &&
                  currentTrade?.seller?.id != user?.id
                ? "Buyer"
                : ""}
            </Text>
            <Pressable
              onPress={() => setShowTradeDetails(true)}
              style={[
                {
                  borderRadius: 100,
                  backgroundColor: "#3A3A3A",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 5,
                  paddingHorizontal: 10,
                  padding: 5,
                  justifyContent: "center",
                },
              ]}
            >
              <Text
                style={{
                  fontWeight: 700,
                  fontSize: ms(14),
                  color: colors.secondary,
                }}
              >
                @
                {currentTrade?.offer?.type == "SELL" &&
                currentTrade?.seller?.id == user?.id
                  ? currentTrade?.buyer?.username
                  : currentTrade?.offer?.type == "SELL" &&
                    currentTrade?.seller?.id != user?.id
                  ? currentTrade?.seller?.username
                  : currentTrade?.offer?.type == "BUY" &&
                    currentTrade?.seller?.id == user?.id
                  ? currentTrade?.seller?.username
                  : currentTrade?.offer?.type == "BUY" &&
                    currentTrade?.seller?.id != user?.id
                  ? currentTrade?.buyer?.username
                  : ""}
              </Text>
              <EvilIcons
                name="chevron-right"
                size={ms(20)}
                color={colors.secondary}
              />
            </Pressable>
          </View>
          <View style={styles.middle}>
            <Text
              style={{
                fontWeight: 400,
                fontSize: ms(14),
                color: colors.secondary,
              }}
            >
              Price per 1 {currentTrade?.offer?.crypto}
            </Text>

            <Text
              style={{
                fontWeight: 700,
                fontSize: ms(14),
                color: colors.secondary,
              }}
            >
              1 {currentTrade?.offer?.crypto} ={" "}
              {priceFormater(currentCoin?.price || 0, { style: "currency" })}
            </Text>
          </View>
          <View style={styles.middle}>
            <Text
              style={{
                fontWeight: 400,
                fontSize: ms(14),
                color: colors.secondary,
              }}
            >
              Quantity
            </Text>

            <Text
              style={{
                fontWeight: 700,
                fontSize: ms(14),
                color: colors.accent,
              }}
            >
              {currentTrade?.amountCrypto} {currentCoin?.symbol?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.middle}>
            <Text
              style={{
                fontWeight: 400,
                fontSize: ms(14),
                color: colors.secondary,
              }}
            >
              Payment Method
            </Text>

            <Text
              style={{
                fontWeight: 700,
                fontSize: ms(14),
                color: colors.secondary,
              }}
            >
              {currentTrade?.offer?.paymentMethod?.name}
            </Text>
          </View>
          <View style={styles.bottom}>
            <Text
              style={{
                fontWeight: 400,
                fontSize: ms(14),
                color: colors.secondary,
              }}
            >
              Status
            </Text>
            <TradeStatus type={type} status={currentTrade?.status} />
          </View>
        </View>

        {type == "seller" ? (
          <View style={globalStyles.sectionBox}>
            <Text
              style={{
                fontSize: ms(14),
                fontWeight: 700,
                color: colors.white2,
                lineHeight: 24,
                marginBottom: 10,
              }}
            >
              Helpful Tips
            </Text>
            <View style={{ gap: 5 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Entypo name="dot-single" size={24} color={colors.secondary} />
                <Text
                  style={{
                    fontSize: ms(14),
                    fontWeight: 400,
                    color: colors.secondary,
                    lineHeight: 24,
                    flexShrink: 1,
                  }}
                >
                  Don’t release before confirmation.
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 5,
                }}
              >
                <Entypo name="dot-single" size={24} color={colors.secondary} />
                <Text
                  style={{
                    fontSize: ms(14),
                    fontWeight: 400,
                    color: colors.secondary,
                    lineHeight: 24,
                    flexShrink: 1,
                  }}
                >
                  Only accept payments from verified accounts.
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={globalStyles.sectionBox}>
            <Text
              style={{
                fontSize: ms(14),
                fontWeight: 700,
                color: colors.white2,
                lineHeight: 24,
                marginBottom: 10,
              }}
            >
              Helpful Tips
            </Text>
            <View style={{ gap: 5 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Entypo name="dot-single" size={24} color={colors.secondary} />
                <Text
                  style={{
                    fontSize: ms(14),
                    fontWeight: 400,
                    color: colors.secondary,
                    lineHeight: 24,
                    flexShrink: 1,
                  }}
                >
                  Only pay from your personal account.
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 5,
                }}
              >
                <Entypo name="dot-single" size={24} color={colors.secondary} />
                <Text
                  style={{
                    fontSize: ms(14),
                    fontWeight: 400,
                    color: colors.secondary,
                    lineHeight: 24,
                    flexShrink: 1,
                  }}
                >
                  Don’t write “Bitcoin,” “Crypto,” or “Evolve2p” in your
                  transfer note.
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 5,
                }}
              >
                <Entypo name="dot-single" size={24} color={colors.secondary} />
                <Text
                  style={{
                    fontSize: ms(14),
                    fontWeight: 400,
                    color: colors.secondary,
                    lineHeight: 24,
                    flexShrink: 1,
                  }}
                >
                  Complete the transfer before the timer ends.
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={globalStyles.sectionBox}>
          <Text
            style={{
              fontSize: ms(14),
              fontWeight: 700,
              color: colors.white2,
              lineHeight: 24,
              marginBottom: 10,
            }}
          >
            Offer Terms (please read carefully)
          </Text>
          <View style={{ gap: 5 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Entypo name="dot-single" size={24} color={colors.secondary} />
              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: 400,
                  color: colors.secondary,
                  lineHeight: 24,
                  flexShrink: 1,
                }}
              >
                Only first-party payments.
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "flex-start", gap: 5 }}
            >
              <Entypo name="dot-single" size={24} color={colors.secondary} />
              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: 400,
                  color: colors.secondary,
                  lineHeight: 24,
                  flexShrink: 1,
                }}
              >
                Bank-to-bank transfers only.
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "flex-start", gap: 5 }}
            >
              <Entypo name="dot-single" size={24} color={colors.secondary} />
              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: 400,
                  color: colors.secondary,
                  lineHeight: 24,
                  flexShrink: 1,
                }}
              >
                May request extra KYC.
              </Text>
            </View>
          </View>
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

        {currentTrade?.status == "CANCELLED" ? null : (
          <Pressable
            onPress={() =>
              showAlert(
                type == "seller"
                  ? "Confirm payment received?"
                  : "Made the payment?",
                type == "seller"
                  ? `Have you verified the buyer's payment in your bank account? This action will release ${currentTrade?.amountCrypto} ${currentTrade?.amountFiat} from escrow to the buyer.`
                  : "Ensure you’ve made payment of the exact amount using the provided payment method.",
                [
                  {
                    text: "Cancle",
                    onPress() {},
                    style: { backgroundColor: "#2D2D2D" },
                  },
                  {
                    text: type == "seller" ? "Release Crypto" : "Yes, Paid",
                    onPress: type == "seller" ? handleRelease : handlePaid,
                    style: { backgroundColor: colors.accent },
                    textStyle: { color: colors.primary },
                  },
                ],
                "info"
              )
            }
            disabled={isPaying}
            style={[
              globalStyles.btn,
              {
                marginTop: 20,
                marginBottom: 20,
                width: "100%",
                opacity: isPaying ? 0.5 : 1,
              },
            ]}
          >
            {isPaying ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={globalStyles.btnText}>
                {" "}
                {type == "seller"
                  ? "Confirm Payment Recieved"
                  : "Paid, Notify Seller"}{" "}
              </Text>
            )}
          </Pressable>
        )}
        {/* end of submit button */}
      </View>

      <TraderProfile
        setVisible={setShowTradeDetails}
        visible={showTradeDetails}
        userId={
          type == "buyer" ? currentTrade?.seller?.id : currentTrade?.buyer?.id
        }
      />
    </View>
  );
};

export default StepOne;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headingText: {
    fontWeight: 700,
    fontSize: ms(24),
    color: colors.white2,
    lineHeight: 32,
  },
  subHeadingText: {
    fontWeight: 500,
    fontSize: ms(12),
    color: colors.gray4,
    lineHeight: 18,
  },
  flexContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "flex-start",
  },
  top: {
    backgroundColor: colors.gray2,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  middle: {
    backgroundColor: colors.gray2,
    // borderTopRightRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottom: {
    backgroundColor: colors.gray2,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
