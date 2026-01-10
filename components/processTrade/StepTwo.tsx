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
import { useUserStore } from "@/store/userStore";
import TraderProfile from "../TraderProfile";
import CurrencyPriceAmount from "@/components/CurrencyPriceAmount";
import { useCountdown } from "@/hooks/useCountdown";

interface pageProps {
  currentTrade: any;
  setActiveTab: Dispatch<SetStateAction<string>>;
  setCompletedSteps: Dispatch<SetStateAction<string[]>>;
  tradeId: string;
  setIsOpenChat: Dispatch<SetStateAction<boolean>>;
  setIsOpenDispute: Dispatch<SetStateAction<boolean>>;
  isOpenDispute: boolean;
  type: string;
}

const getCoinId = (coin: string) => {
  // Map common coin symbols to CoinGecko IDs
  const map: Record<string, string> = {
    BTC: "bitcoin",
    ETH: "ethereum",
    USDT: "tether",
    BNB: "binancecoin",
    TRX: "tron",
  };
  return map[coin.toUpperCase()] || coin.toLowerCase();
};

const StepTwo = ({
  currentTrade,
  tradeId,
  setActiveTab,
  setCompletedSteps,
  setIsOpenChat,
  setIsOpenDispute,
  isOpenDispute,
  type,
}: pageProps) => {
  const [isPaying, setIsPaying] = useState(false);
  const actionLabel =
    currentTrade?.offer.type.toLowerCase() === "sell" ? "Buy" : "Sell";
  const coins = useCoinStore((state) => state.coins);

  const [showTradeDetails, setShowTradeDetails] = useState(false);

  const user = useUserStore((state) => state.user);

  const currentCoin = coins.find(
    (c) => c.symbol?.toUpperCase() == currentTrade?.offer?.crypto
  );

  const { isExpired, minutes, seconds } = useCountdown(
    currentTrade?.paidAt,
    10
  );
  const {
    isExpired: isSupportElapsed,
    minutes: supportMinutes,
    seconds: supportSeconds,
  } = useCountdown(currentTrade?.disputeOpenedAt, 30);
  const { AlertComponent, showAlert } = useAlert();

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
              setActiveTab("step-three");
              setCompletedSteps((tabs) => [...tabs, "step-two"]);
            },
          },
        ],
        "success"
      );
      setIsPaying(false);
    }
  };

  return (
    <View style={styles.container}>
      {AlertComponent}
      <View style={styles.flexContainer}>
        <View>
          <Text style={styles.headingText}>Trade {currentTrade?.status}</Text>
        </View>
      </View>

      <Pressable
        onPress={() => setIsOpenChat(true)}
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

      {currentTrade?.status !== "DISPUTED" && (
        <View
          style={[
            globalStyles.sectionBox,
            {
              backgroundColor: "#352E21",
              borderLeftWidth: 2,
              borderLeftColor: "#FFC051",
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 10,
              paddingVertical: 16,
              paddingStart: 8,
              paddingEnd: 16,
            }}
          >
            <AntDesign name="exclamation-circle" size={15} color="#FFC051" />
            <View>
              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: 500,
                  color: colors.white2,
                  lineHeight: 20,
                }}
              >
                Your {currentTrade?.offer?.crypto} is held in escrow by
                Evolve2p.
              </Text>
              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: 400,
                  color: colors.secondary,
                  lineHeight: 20,
                }}
              >
                It will be released once the seller confirms your payment.
              </Text>
            </View>
          </View>
        </View>
      )}

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

            <Text
              style={{
                fontWeight: 500,
                fontSize: ms(16),
                color: "#33A2FF",
              }}
            >
              {formatNumber(currentTrade?.amountFiat)}{" "}
              {currentTrade?.offer?.currency}
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
              {/* {currentTrade?.offer?.type == "SELL" &&
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
                : ""} */}

              {(() => {
                const isSeller = currentTrade?.seller?.id === user?.id;
                const isBuyer = currentTrade?.buyer?.id === user?.id;

                if (isSeller) return "Buyer"; // you are selling → show buyer
                if (isBuyer) return "Seller"; // you are buying → show seller
                return ""; // fallback
              })()}
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
                {/* {currentTrade?.offer?.type == "SELL" &&
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
                  : ""} */}
                {(() => {
                  if (!currentTrade) return "";

                  const isSeller = currentTrade.seller?.id === user?.id;
                  const isBuyer = currentTrade.buyer?.id === user?.id;

                  if (isSeller) return currentTrade.buyer?.username || "";
                  if (isBuyer) return currentTrade.seller?.username || "";

                  return ""; // fallback
                })()}
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
              1 {currentTrade?.offer?.crypto} = {currentTrade?.offer?.currency}{" "}
              {priceFormater(currentTrade?.tradePrice, {
                style: "standard",
              })}
              {/* {priceFormater(currentCoin?.price || 0, { style: "currency" })} */}
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
              {Number(currentTrade?.amountCrypto).toFixed(6)}{" "}
              {currentCoin?.symbol?.toUpperCase()}
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
            <TradeStatus status={currentTrade?.status} />
          </View>
        </View>
      </View>

      <View
        style={[
          globalStyles.sectionBox,
          {
            backgroundColor: "#342827",
            borderLeftWidth: 2,
            borderLeftColor: "#FE857D",
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
        ]}
      >
        {/* {currentTrade?.status == "DISPUTED" ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 10,
              paddingVertical: 16,
              paddingStart: 8,
              paddingEnd: 16,
            }}
          >
            <AntDesign name="exclamation-circle" size={15} color="#FE857D" />
            <View>
              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: 400,
                  color: colors.secondary,
                  lineHeight: 20,
                }}
              >
                Please don’t make another payment unless instructed by support.
                All updates will be shared here.
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 10,
              paddingVertical: 16,
              paddingStart: 8,
              paddingEnd: 16,
            }}
          >
            <AntDesign name="exclamation-circle" size={15} color="#FE857D" />
            <View>
              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: 500,
                  color: colors.white2,
                  lineHeight: 20,
                }}
              >
                Haven’t heard from the seller?
              </Text>
              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: 400,
                  color: colors.secondary,
                  lineHeight: 20,
                }}
              >
                You can open a dispute if the seller hasn’t responded within 10
                minutes.
              </Text>
            </View>
          </View>
        )}

        {currentTrade?.status != "DISPUTED" && (
          <Pressable
            onPress={() => setIsOpenDispute(true)}
            style={[
              globalStyles.btn,
              { backgroundColor: "#FE857D", width: "50%" },
            ]}
          >
            <Text style={[globalStyles.btnText]}>Open Dispute</Text>
          </Pressable>
        )} */}

        {/* Status Banner */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 10,
            paddingVertical: 16,
            paddingStart: 8,
            paddingEnd: 16,
          }}
        >
          <AntDesign name="exclamation-circle" size={15} color="#FE857D" />

          {/* DISPUTED STATUS */}

          {currentTrade?.status === "DISPUTED" ? (
            <View style={{ flexDirection: "column", gap: 10 }}>
              {/* Message while waiting for support */}
              {!isSupportElapsed ? (
                <Text
                  style={{
                    fontSize: ms(14),
                    color: colors.secondary,
                    lineHeight: 20,
                  }}
                >
                  A dispute is currently open. Customer support will respond in{" "}
                  <Text style={{ color: colors.white2 }}>
                    {supportMinutes}:{supportSeconds < 10 ? "0" : ""}
                    {supportSeconds}
                  </Text>
                  . Please don’t make another payment unless instructed by
                  support. All updates will be shared here.
                </Text>
              ) : (
                // Message after support response time elapsed
                <Text
                  style={{
                    fontSize: ms(14),
                    color: colors.secondary,
                    lineHeight: 20,
                  }}
                >
                  The expected response time from customer support has elapsed.
                  You will receive an update here shortly, or you may follow up
                  with support if needed.
                </Text>
              )}
            </View>
          ) : (
            <View style={{ flexDirection: "column", gap: 10 }}>
              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: "500",
                  color: colors.white2,
                  lineHeight: 20,
                }}
              >
                Haven’t heard from the seller?
              </Text>

              {!isExpired ? (
                <Text
                  style={{
                    fontSize: ms(14),
                    fontWeight: "400",
                    color: colors.secondary,
                    lineHeight: 20,
                  }}
                >
                  You can open a dispute in{" "}
                  <Text style={{ color: colors.white2 }}>
                    {minutes}:{seconds < 10 ? "0" : ""}
                    {seconds}
                  </Text>
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: ms(14),
                    fontWeight: "400",
                    color: colors.secondary,
                    lineHeight: 20,
                  }}
                >
                  You can now open a dispute if the seller hasn’t responded.
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Dispute Button */}
        {currentTrade?.status !== "DISPUTED" && (
          <Pressable
            disabled={!isExpired}
            onPress={() => setIsOpenDispute(true)}
            style={[
              globalStyles.btn,
              {
                backgroundColor: isExpired ? "#FE857D" : "#FE857D55",
                width: "50%",
              },
            ]}
          >
            <Text style={globalStyles.btnText}>
              {isExpired ? "Open Dispute" : "Dispute Locked"}
            </Text>
          </Pressable>
        )}
      </View>

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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
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
              Don’t write “Bitcoin,” “Crypto,” or “Evolve2p” in your transfer
              note.
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
              Complete the transfer before the timer ends.
            </Text>
          </View>
        </View>
      </View>

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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
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
      {/* <Pressable
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
      </Pressable> */}
      {/* end of read guide */}

      {/* submit button */}
      {currentTrade?.status == "PAID" && type == "seller" && (
        <>
          {currentTrade?.status == "CANCELLED" ||
          (currentTrade?.status == "PAID" &&
            currentTrade?.seller?.id != user?.id) ? null : (
            <Pressable
              onPress={() =>
                showAlert(
                  "Confirm payment received?",
                  `Have you verified the buyer's payment in your bank account? This action will release ${currentTrade?.amountCrypto} ${currentTrade?.offer?.crypto} from escrow to the buyer.`,

                  [
                    {
                      text: "Cancle",
                      onPress() {},
                      style: { backgroundColor: "#2D2D2D" },
                    },
                    {
                      text: "Release Crypto",
                      onPress: handleRelease,
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
                  Confirm Payment Recieved
                </Text>
              )}
            </Pressable>
          )}
        </>
      )}
      {/* end of submit button */}

      <TraderProfile
        setVisible={setShowTradeDetails}
        visible={showTradeDetails}
        userId={
          currentTrade?.offer?.type == "SELL" &&
          currentTrade?.seller?.id == user?.id
            ? currentTrade?.buyer?.id
            : currentTrade?.offer?.type == "SELL" &&
              currentTrade?.seller?.id != user?.id
            ? currentTrade?.seller?.id
            : currentTrade?.offer?.type == "BUY" &&
              currentTrade?.seller?.id == user?.id
            ? currentTrade?.seller?.id
            : currentTrade?.offer?.type == "BUY" &&
              currentTrade?.seller?.id != user?.id
            ? currentTrade?.buyer?.id
            : ""
        }
      />
    </View>
  );
};

export default StepTwo;

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
