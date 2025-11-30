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
const StepThree = ({
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

  const [showTradeDetails, setShowTradeDetails] = useState(false);

  const user = useUserStore((state) => state.user);

  const currentCoin = coins.find(
    (c) => c.symbol?.toUpperCase() == currentTrade?.offer?.crypto
  );

  const { AlertComponent, showAlert } = useAlert();

  const handleGoToChat = () => {
    setIsOpenChat(true);
  };

  return (
    <View style={styles.container}>
      {AlertComponent}
      <View style={styles.flexContainer}>
        <View>
          <Text style={styles.headingText}>
            Trade{" "}
            {currentTrade?.status == "CANCELLED" ? "Cancelled" : "Completed"}
          </Text>
          {/* <Text style={styles.subHeadingText}>
            Order ID: E2P-2453019273001180
          </Text> */}
        </View>

        {/* <View
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
              fontWeight: 500,
              color: colors.secondary,
            }}
          >
            28.46
          </Text>
        </View> */}
      </View>

      {currentTrade?.status == "COMPLETED" && (
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
            ? `The trade has been completed successfully. You released ${currentTrade?.amountCrypto} ${currentTrade?.offer?.crypto} to @${currentTrade?.buyer?.username}. Funds have been transferred to buyer’s wallet.`
            : "The trade has been completed successfully. Your purchase is confirmed."}
        </Text>
      )}

      {currentTrade?.status == "CANCELLED" && (
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
            ? `Your trade with @${currentTrade?.buyer?.username} has been Cancelled.`
            : `Your trade with @${currentTrade?.seller?.username} has been Cancelled.`}
        </Text>
      )}
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
      </View>

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

export default StepThree;

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
