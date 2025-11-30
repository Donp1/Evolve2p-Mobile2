import { Offer } from "@/hooks/useOffers";
import { priceFormater } from "@/utils/countryStore";
import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { colors } from "@/constants";
import { ms } from "react-native-size-matters";
import { CoinData, useCoinStore } from "@/context";
import { Image } from "expo-image";

export function getInitials(username: string) {
  if (!username) return "";
  const words = username.trim().split(" ");
  return words.length === 1
    ? words[0].substring(0, 2).toUpperCase()
    : `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export interface ActionableOffer extends Offer {
  actionLabel: string; // e.g., "Buy" or "Sell"
}

interface OfferCardProps {
  offer: Offer;
  onAction?: (id: string) => void; // callback when Buy/Sell pressed
  isUserDetails?: boolean;
}

// Helper: retry fetch with exponential backoff
async function fetchWithRetry(
  url: string,
  retries = 3,
  delay = 500,
  signal?: AbortSignal
) {
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return await res.json();
  } catch (err: any) {
    if (retries > 0 && err.name !== "AbortError") {
      await new Promise((res) => setTimeout(res, delay));
      return fetchWithRetry(url, retries - 1, delay * 2, signal);
    }
    throw err;
  }
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

  const abortController = useRef<AbortController | null>(null);

  const cryptoMap = useMemo(
    () => ({
      BTC: "bitcoin",
      ETH: "ethereum",
      USDT: "tether",
      USDC: "usd-coin",
    }),
    []
  );

  useEffect(() => {
    setCurrentCoin(
      coins.find(
        (coin) => coin.symbol.toUpperCase() === offer?.crypto?.toUpperCase()
      )
    );
  }, [coins, offer?.crypto]);

  // useEffect(() => {
  //   if (!offer.crypto) return;

  //   const fetchPrice = async () => {
  //     abortController.current?.abort(); // cancel any previous request
  //     const controller = new AbortController();
  //     abortController.current = controller;

  //     try {
  //       setLoading(true);
  //       const data = await fetchWithRetry(
  //         "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin&vs_currencies=usd",
  //         3,
  //         500,
  //         controller.signal
  //       );

  //       const cryptoId =
  //         cryptoMap[offer.crypto.toUpperCase() as keyof typeof cryptoMap];
  //       if (!cryptoId || !data[cryptoId]) {
  //         throw new Error("Invalid coin symbol or missing data.");
  //       }
  //       setBasePrice(data[cryptoId].usd);
  //     } catch (err) {
  //       if ((err as any).name !== "AbortError") {
  //         console.error("Error fetching crypto price:", err);
  //         setBasePrice(null);
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPrice();

  //   return () => {
  //     abortController.current?.abort();
  //   };
  // }, [offer.crypto, cryptoMap]);

  const adjustedPrice = useMemo(() => {
    if (basePrice === null) return null;
    if (offer.margin && offer.margin !== 0) {
      return basePrice + basePrice * (offer.margin / 100);
    }
    return basePrice;
  }, [basePrice, offer.margin]);

  return (
    <View style={styles.card}>
      {/* Details */}
      <View style={styles.detailsRow}>
        <View>
          <View style={styles.cryptoRow}>
            <Image
              source={{ uri: currentCoin?.image }}
              style={{ width: 15, height: 15 }}
            />
            <Text style={styles.subText}>
              {offer.crypto} • {offer?.currency}
            </Text>
          </View>
          <Text style={styles.marginText}>Margin: {offer?.margin}%</Text>
        </View>

        <View>
          <Text style={styles.subText}>PRICE</Text>
          <Text style={styles.marginText}>
            {offer?.currency}{" "}
            {priceFormater(offer?.finalPrice, { style: "standard" })}
          </Text>
          {/* {loading ? (
            <ActivityIndicator size="small" color={colors.secondary} />
          ) : adjustedPrice ? (
            <Text style={styles.marginText}>
              ${priceFormater(adjustedPrice, { style: "short" })}
            </Text>
          ) : (
            <Text style={styles.typeBadge}>Price unavailable</Text>
          )} */}
        </View>
      </View>

      {/* Limits & Payment */}
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Limits</Text>
          <Text style={styles.value}>
            {priceFormater(offer.minLimit, { style: "short" })} -{" "}
            {priceFormater(offer.maxLimit, { style: "short" })} {offer.currency}
          </Text>
        </View>
        <View style={styles.paymentBox}>
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
  );
};

export default OfferCardUI;

const styles = StyleSheet.create({
  card: {},
  detailsRow: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: 15,
  },
  cryptoRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  subText: { color: "#9ca3af", fontSize: ms(13) },
  marginText: {
    fontSize: ms(18),
    fontWeight: "700",
    color: "#fff",
    marginTop: 4,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: ms(12),
    fontWeight: "600",
    overflow: "hidden",
    color: "#bbb",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  label: { fontSize: ms(11), color: "#9ca3af" },
  value: { fontSize: ms(14), fontWeight: "500", color: "#e5e7eb" },
  paymentBox: {
    borderLeftWidth: 2,
    borderLeftColor: "#FFFA66",
    paddingHorizontal: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  footerText: { fontSize: 11, color: "#6b7280" },
  actionButton: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  buyBtn: { backgroundColor: "#22c55e" },
  sellBtn: { backgroundColor: "#ef4444" },
  actionText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});
