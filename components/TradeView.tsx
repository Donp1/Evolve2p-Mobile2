import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalStyles } from "@/utils/globalStyles";
import { useCoinStore } from "@/context";
import { Image } from "expo-image";
import { ms } from "react-native-size-matters";
import { colors } from "@/constants";
import TradeStatus from "./TradeStatus";
import { priceFormater } from "@/utils/countryStore";
import { router } from "expo-router";
import { useUserStore } from "@/store/userStore";

interface PageProps {
  trade: any;
}

function formatDate(createdAt: string | Date): string {
  const date = new Date(createdAt);

  // Format: Aug 20 2025
  return date.toLocaleDateString("en-US", {
    month: "short", // Aug
    day: "2-digit", // 20
    year: "numeric", // 2025
  });
}

const TradeView = ({ trade }: PageProps) => {
  const coins = useCoinStore((state) => state.coins);
  const user = useUserStore((state) => state.user);
  const currentCoin = coins.find(
    (coin) => coin.symbol?.toUpperCase() == trade?.offer?.crypto?.toUpperCase()
  );
  const actionLabel =
    trade?.offer?.type === "SELL"
      ? trade?.offer?.user?.id === user?.id
        ? "Sell" // It's your own SELL offer
        : "Buy" // It's someone else's SELL offer
      : trade?.offer?.type === "BUY"
      ? trade?.offer?.user?.id === user?.id
        ? "Buy" // It's your own BUY offer
        : "Sell" // It's someone else's BUY offer
      : "";

  const paymentInfo =
    trade?.offer?.type === "SELL"
      ? trade?.offer?.user?.id === user?.id
        ? {
            youPay: `${trade.amountCrypto} ${trade?.offer.crypto}`, // Seller pays crypto
            youReceive: `${priceFormater(trade.amountFiat)} ${
              trade?.offer?.currency
            }`, // Seller receives fiat
          }
        : {
            youPay: `${priceFormater(trade.amountFiat)} ${
              trade?.offer?.currency
            }`, // Buyer pays fiat
            youReceive: `${trade.amountCrypto} ${trade?.offer?.crypto}`, // Buyer receives crypto
          }
      : trade?.offer?.type === "BUY"
      ? trade?.offer?.user?.id === user?.id
        ? {
            youPay: `${priceFormater(trade.amountFiat)} ${
              trade?.offer?.currency
            }`, // Buyer pays fiat
            youReceive: `${trade.amountCrypto} ${trade?.offer?.crypto}`, // Buyer receives crypto
          }
        : {
            youPay: `${trade.amountCrypto} ${trade?.offer?.crypto}`, // Seller pays crypto
            youReceive: `${priceFormater(trade.amountFiat)} ${
              trade?.offer?.currency
            }`, // Seller receives fiat
          }
      : null;
  return (
    <View
      style={[
        globalStyles.sectionBox,
        { backgroundColor: "#222222", margin: 0 },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Image
            source={{ uri: currentCoin?.image }}
            style={{ width: ms(20), height: ms(20) }}
          />
          <Text
            style={{ fontWeight: 700, fontSize: ms(16), color: colors.white2 }}
          >
            {actionLabel} {trade?.offer?.crypto}
          </Text>
        </View>
        <TradeStatus status={trade?.status} />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            borderLeftColor: "#FFFA66",
            borderLeftWidth: 2,
            paddingLeft: 5,
            fontWeight: 500,
            fontSize: ms(14),
            color: colors.secondary,
          }}
        >
          {trade?.offer?.paymentMethod?.name}
        </Text>
        <Text
          style={{ fontWeight: 500, fontSize: ms(14), color: colors.secondary }}
        >
          {trade?.offer?.type === "SELL"
            ? trade?.offer?.user?.id === user?.id
              ? `Sell to  @${trade?.buyer?.username}` // your own SELL offer
              : `Buy from  @${trade?.offer?.user?.username}` // someone else’s SELL offer
            : trade?.offer?.type === "BUY"
            ? trade?.offer?.user?.id === user?.id
              ? `Buy from  @${trade?.seller?.username}` // your own BUY offer
              : `Sell to  @${trade?.offer?.user?.username}` // someone else’s BUY offer
            : ""}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <View style={{ gap: 5 }}>
          <Text
            style={{
              fontWeight: 500,
              fontSize: ms(14),
              color: colors.secondary,
            }}
          >
            You pay
          </Text>
          <Text
            style={{
              fontWeight: 500,
              fontSize: ms(14),
              color: colors.secondary,
            }}
          >
            {paymentInfo?.youPay}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end", gap: 5 }}>
          <Text
            style={{
              fontWeight: 500,
              fontSize: ms(14),
              color: colors.secondary,
            }}
          >
            You Receive
          </Text>
          <Text
            style={{
              fontWeight: 500,
              fontSize: ms(14),
              color: colors.secondary,
            }}
          >
            {paymentInfo?.youReceive}
          </Text>
        </View>
      </View>

      <View style={globalStyles.divider} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        <Text
          style={{ fontWeight: 500, fontSize: ms(12), color: colors.gray4 }}
        >
          {formatDate(trade?.createdAt)}
        </Text>

        <Pressable onPress={() => router.push(`/process-trade/${trade?.id}`)}>
          <Text
            style={{ fontWeight: 700, fontSize: ms(14), color: colors.accent }}
          >
            View
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default TradeView;

const styles = StyleSheet.create({});
