import { Offer } from "@/hooks/useOffers";
import { formatNumber, priceFormater } from "@/utils/countryStore";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import CryptoPriceWithMargin from "./CryptoPriceWithMargin ";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import { CoinData, useCoinStore } from "@/context";
import { Image } from "expo-image";

export function getInitials(username: string) {
  if (!username) return "";
  const words = username.trim().split(" ");
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export interface ActionableOffer extends Offer {
  actionLabel: string; // e.g., "Buy" or "Sell"
}

interface OfferCardProps {
  offer: Offer;
  onAction?: (id: string) => void; // callback when Buy/Sell pressed
  isUserDetails?: boolean;
}

const OfferCardUI: React.FC<OfferCardProps> = ({
  offer,
  onAction,
  isUserDetails,
}) => {
  const actionLabel = offer.type.toLowerCase() === "sell" ? "Buy" : "Sell";
  const isBuyAction = actionLabel === "Buy";

  const [loading, setLoading] = useState(false);
  const [basePrice, setBasePrice] = useState<number | null>(null);
  const coins = useCoinStore((state) => state.coins);

  const [currentCoin, setCurrentCoin] = useState<CoinData>();

  useEffect(() => {
    if (!offer.crypto) return;

    const fetchPrice = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin&vs_currencies=usd"
        );
        const data = await res.json();

        const cryptoMap = {
          BTC: "bitcoin",
          ETH: "ethereum",
          USDT: "tether",
          USDC: "usd-coin",
        };

        const cryptoId =
          cryptoMap[offer.crypto.toUpperCase() as keyof typeof cryptoMap];
        if (!cryptoId || !data[cryptoId]) {
          throw new Error("Invalid coin symbol or missing data.");
        }

        setBasePrice(data[cryptoId].usd);
      } catch (err) {
        console.error("Error fetching crypto price:", err);
        setBasePrice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [offer.crypto]);

  useEffect(() => {
    setCurrentCoin(
      coins.find(
        (coin) => coin.symbol.toUpperCase() == offer?.crypto?.toUpperCase()
      )
    );
  }, []);

  const adjustedPrice =
    basePrice !== null
      ? offer.margin && offer.margin !== 0
        ? basePrice + basePrice * (offer.margin / 100)
        : basePrice
      : null;

  return (
    <>
      <View style={styles.card}>
        {/* Details */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            marginVertical: 15,
          }}
        >
          <View style={{}}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Image
                source={{ uri: currentCoin?.image }}
                style={{ width: 15, height: 15 }}
              />
              <Text style={styles.subText}>
                {offer.crypto} • {offer.currency}
              </Text>
            </View>
            <Text style={styles.marginText}>Margin: {offer.margin}%</Text>
          </View>

          <View style={{}}>
            <Text style={styles.subText}>PRICE</Text>
            {loading ? (
              <ActivityIndicator size="small" color={colors.secondary} />
            ) : (
              <View>
                {adjustedPrice ? (
                  <Text style={styles.marginText}>
                    ${priceFormater(adjustedPrice, { style: "short" })}
                  </Text>
                ) : (
                  <Text style={styles.typeBadge}>Price unavailable</Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Limits & Payment */}
        <View style={styles.row}>
          <View style={{}}>
            <Text style={styles.label}>Limits</Text>
            <Text style={styles.value}>
              {priceFormater(offer.minLimit, { style: "short" })} -{" "}
              {priceFormater(offer.maxLimit, { style: "short" })}{" "}
              {offer.currency}
            </Text>
          </View>
          <View
            style={{
              borderLeftWidth: 2,
              borderLeftColor: "#FFFA66",
              paddingHorizontal: 5,
            }}
          >
            <Text style={styles.label}>Payment</Text>
            <Text style={styles.value}>{offer.paymentMethod.name}</Text>
          </View>
        </View>

        {/* Footer with Button */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Created: {new Date(offer.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.footerText}>⏱ {offer.time}</Text>

          <Pressable
            style={[
              styles.actionButton,
              isBuyAction ? styles.buyBtn : styles.sellBtn,
            ]}
            onPress={() => onAction?.(offer.id)}
          >
            <Text style={styles.actionText}>
              {actionLabel} {offer.crypto}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default OfferCardUI;

const styles = StyleSheet.create({
  card: {},
  header: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: ms(12),
    fontWeight: "600",
    overflow: "hidden",
  },
  buyBadge: {
    backgroundColor: "rgba(34,197,94,0.2)",
    color: "#4ade80",
  },
  sellBadge: {
    backgroundColor: "rgba(239,68,68,0.2)",
    color: "#f87171",
  },
  details: {
    marginBottom: 12,
  },
  subText: {
    color: "#9ca3af",
    fontSize: ms(13),
  },
  marginText: {
    fontSize: ms(18),
    fontWeight: "700",
    color: "#fff",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  label: {
    fontSize: ms(11),
    color: "#9ca3af",
  },
  value: {
    fontSize: ms(14),
    fontWeight: "500",
    color: "#e5e7eb",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  footerText: {
    fontSize: 11,
    color: "#6b7280",
  },
  actionButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buyBtn: {
    backgroundColor: "#22c55e",
  },
  sellBtn: {
    backgroundColor: "#ef4444",
  },
  actionText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  icon: {
    backgroundColor: "#4A4A4A",
    width: ms(35),
    height: ms(35),
    borderRadius: ms(35) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
